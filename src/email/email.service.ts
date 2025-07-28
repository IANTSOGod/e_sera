import { HttpException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailsendDto } from 'src/interfaces/dto/Emailsend.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_PROVIDER,
        pass: process.env.GOOGLE_PROVIDER_SECRET,
      },
    });
  }

  public async sendOtp(data: EmailsendDto) {
    try {
      await this.transporter.sendMail(data);
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: 'Email non envoyé' }, 405);
    }
  }
}
