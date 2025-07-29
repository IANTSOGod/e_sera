import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { Jwtsigndto } from 'src/interfaces/dto/jwtsign.dto';
import { Logindto } from 'src/interfaces/dto/login.dto';
import { OtpSendDto } from 'src/interfaces/dto/OtpSend.dto';
import { OtpVerificationDto } from 'src/interfaces/dto/OtpVerification.dto';
import { ResetpasswordDto } from 'src/interfaces/dto/Resetpassword.dto';
import { Signupdto } from 'src/interfaces/dto/signup.dto';
import { OtpService } from 'src/otp/otp.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly jwtservice: JwtService,
    private readonly emailservice: EmailService,
    private readonly otpservice: OtpService,
  ) {}

  async login(data: Logindto) {
    const { email, password } = data;
    const response = await this.prismaservice.user.findUnique({
      where: { email: email },
    });

    if (response) {
      const ispassvalid = await compare(password, response.password);

      if (ispassvalid) {
        if (response.isverified) {
          return this.jwtsign({ email: response.email });
        } else {
          throw new UnauthorizedException({ message: 'Email non vérifié' });
        }
      } else {
        throw new UnauthorizedException({ message: 'Invalid credentials' });
      }
    } else {
      throw new NotFoundException({ message: 'Aucun user correspondant' });
    }
  }

  async registerEmailandPassword(data: Signupdto) {
    const { username, email, password } = data;
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
            provider: 'EMAIL',
          },
        });
        if (response) {
          return { email: response.email };
        }
      } catch (error) {
        console.log(error); //to remove in production
        throw new HttpException({ message: 'Erreur de création' }, 500);
      }
    }
  }

  async sendOtp(data: OtpSendDto) {
    const otpcontent = this.otpservice.generateToken();
    try {
      await this.emailservice.sendEmail({
        to: data.email,
        subject: 'Otp verification',
        text: `Please insert this code in the app : ${otpcontent}`,
      });
      return { message: 'Email envoyé' };
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: 'Echec vérification email' }, 500);
    }
  }

  async verifyAccount(data: OtpVerificationDto) {
    const isvalid = this.otpservice.verifyToken(data.otp);
    if (isvalid) {
      try {
        await this.prismaservice.user.update({
          data: {
            isverified: true,
          },
          where: {
            email: data.email,
          },
        });
        return this.jwtsign({ email: data.email });
      } catch (error) {
        console.log(error);
        throw new HttpException({ message: 'Compte non vérifié' }, 500);
      }
    } else {
      throw new UnauthorizedException({ message: 'Otp expiré' });
    }
  }

  async sendResetCode(data: OtpSendDto) {
    const otpcontent = this.otpservice.generateToken();
    try {
      await this.emailservice.sendEmail({
        to: data.email,
        subject: 'Reset password',
        text: `Use this code in the app to continue ${otpcontent}`,
      });
      return { message: 'Code de changement envoyé' };
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: "Erreur lors de l'envoi" }, 500);
    }
  }

  async resetPassword(data: ResetpasswordDto) {
    const isvalid = this.otpservice.verifyToken(data.otp);
    if (isvalid) {
      const mdp = await hash(data.newpassword, 12);
      try {
        await this.prismaservice.user.update({
          data: {
            password: mdp,
          },
          where: {
            email: data.email,
          },
        });
        return { message: 'Mot de passe changé' };
      } catch (error) {
        console.log(error);
        throw new NotFoundException({ message: 'User non trouvé' });
      }
    } else {
      throw new UnauthorizedException({ message: 'Otp expiré' });
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
