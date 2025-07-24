import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Jwtsigndto } from 'src/interfaces/dto/jwtsign.dto';
import { Logindto } from 'src/interfaces/dto/login.dto';
import { Signupdto } from 'src/interfaces/dto/signup.dto';
import { Credentialsresponse } from 'src/interfaces/types/Credentialsresponse';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaservice: PrismaService) {}

  async login(data: Logindto) {
    const { email, password } = data;
    const response = await this.prismaservice.user.findUnique({
      where: { email: email },
    });

    if (response) {
      const ispassvalid = await compare(password, response.password);

      if (ispassvalid) {
        return new Credentialsresponse(
          response.email,
          response.username,
          response.photolink,
        );
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
          return new Credentialsresponse(
            response.email,
            response.username,
            response.photolink,
          );
        }
      } catch (error) {
        console.log(error); //to remove in production
        throw new HttpException({ message: 'Erreur de création' }, 500);
      }
    }
  }

  private async getuserlist() {
    const response = await this.prismaservice.user.findMany();
    if (response.length > 0) {
      return response;
    } else {
      throw new NotFoundException({ message: 'Aucun user acutellement' });
    }
  }

  //to implement later
  private jwtsign(payload: Jwtsigndto) {
    const { email } = payload;
    console.log(email);
  }
}
