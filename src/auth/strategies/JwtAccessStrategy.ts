// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Credentialdto } from 'src/interfaces/dto/credential.dto';
import { JwtverifDto } from 'src/interfaces/dto/jwtverif.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly prismaservice: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET as string,
    });
  }

  async validate(payload: JwtverifDto) {
    const user = await this.prismaservice.user.findUnique({
      where: { id: payload.id },
    });
    if (user) {
      return {
        email: user.email,
        username: user.username,
        photolink: user.photolink,
      } satisfies Credentialdto;
    }
  }
}
