import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtverifDto } from 'src/interfaces/dto/jwtverif.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET as string,
    });
  }

  async validate(payload: JwtverifDto) {
    const user = await this.prismaservice.user.findUnique({
      where: { id: payload.id },
    });
    if (user) {
      const accesstoken = await this.jwtService.signAsync(
        { id: payload.id },
        {
          expiresIn: '1d',
          secret: process.env.JWT_ACCESS_SECRET as string,
        },
      );
      const updateuser = await this.prismaservice.user.update({
        data: {
          acessToken: accesstoken,
        },
        where: {
          id: user.id,
        },
      });
      if (updateuser) {
        return { accesstoken: accesstoken };
      }
    }
  }
}
