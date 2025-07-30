import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailsendDto } from 'src/interfaces/dto/Emailsend.dto';
import { EmailService } from './email.service';

@Processor('email')
export class EmailProcesssor {
  constructor(private readonly emailservice: EmailService) {}

  @Process('sendEmail')
  async handleEmail(job: Job<EmailsendDto>) {
    // console.log('Traitement de la job de', job.data.to);
    try {
      await this.emailservice.sendEmail(job.data);
    } catch (error) {
      console.log('Erreur queue:', error);
      throw error;
    }
  }
}
