import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { EmailsendDto } from 'src/interfaces/dto/Emailsend.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(@InjectQueue('email') private emailqueue: Queue) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_PROVIDER,
        pass: process.env.GOOGLE_PROVIDER_SECRET,
      },
    });
  }

  //fonction envoi d'email
  public async sendEmail(data: EmailsendDto) {
    try {
      await this.transporter.sendMail(data);
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: 'Email non envoyé' }, 405);
    }
  }

  //ajout a la queue
  public async addtoqueue(data: EmailsendDto) {
    try {
      await this.emailqueue.add('sendEmail', data, {
        attempts: 5,
        backoff: 1000,
      });
    } catch (error) {
      console.log('Erreur ajout a la queue :', error);
      throw new HttpException({ message: 'Erreur email queue' }, 500);
    }
  }
}
