import { Injectable } from '@nestjs/common';
import { totp } from 'otplib';

@Injectable()
export class OtpService {
  constructor() {
    totp.options = {
      digits: 6,
      step: 600,
    };
  }

  generateToken(): string {
    return totp.generate(process.env.TOTP_SECRET as string);
  }

  verifyToken(token: string): boolean {
    return totp.check(token, process.env.TOTP_SECRET as string);
  }
}
