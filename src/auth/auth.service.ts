import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Jwtsigndto } from 'src/interfaces/dto/jwtsign.dto';
import { Logindto } from 'src/interfaces/dto/login.dto';
import { Signupdto } from 'src/interfaces/dto/signup.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly jwtservice: JwtService,
  ) {}

  async login(data: Logindto) {
    const { email, password } = data;
    const response = await this.prismaservice.user.findUnique({
      where: { email: email },
    });

    if (response) {
      const ispassvalid = await compare(password, response.password);

      if (ispassvalid) {
        return this.jwtsign({ email: response.email });
      } else {
        throw new UnauthorizedException({ message: 'Invalid credentials' });
      }
    } else {
      throw new NotFoundException({ message: 'Aucun user correspondant' });
    }
  }

  async registerEmailandPassword(data: Signupdto) {
    const { username, email, password, photolink } = data;
    const hashedmdp = await hash(password, 12);
    const existinguser = await this.prismaservice.user.findUnique({
      where: { email: email },
    });
    if (existinguser) {
      throw new UnauthorizedException({ message: 'Duplicate email' });
    } else {
      try {
        const response = await this.prismaservice.user.create({
          data: {
            email: email,
            username: username,
            password: hashedmdp,
            photolink: photolink,
            provider: 'EMAIL',
          },
        });
        if (response) {
          return this.jwtsign({ email: response.email });
        }
      } catch (error) {
        console.log(error); //to remove in production
        throw new HttpException({ message: 'Erreur de création' }, 500);
      }
    }
  }

  private async jwtsign(payload: Jwtsigndto) {
    const { email } = payload;
    const user = await this.prismaservice.user.findUnique({
      where: { email: email },
    });
    if (user) {
      const payloadata = { id: user.id };
      const accesstoken = await this.jwtservice.signAsync(payloadata, {
        expiresIn: '1d',
        secret: process.env.JWT_ACCESS_SECRET as string,
      });
      const refreshtoken = await this.jwtservice.signAsync(payloadata, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
      const response = await this.prismaservice.user.update({
        data: {
          acessToken: accesstoken,
          refreshToken: refreshtoken,
        },
        where: {
          id: user.id,
        },
      });
      if (response) {
        return {
          accesstoken: accesstoken,
          refreshtoken: refreshtoken,
        };
      } else {
        throw new HttpException({ message: 'Erreur jwt' }, 500);
      }
    } else {
      throw new NotFoundException({ message: 'User inconnu' });
    }
  }
}
