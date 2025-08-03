import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailsendDto } from 'src/interfaces/dto/Emailsend.dto';
import { EmailService } from './email.service';

@Processor('email')
export class EmailProcesssor extends WorkerHost {
  constructor(private readonly emailservice: EmailService) {
    super();
  }

  async process(job: Job<EmailsendDto>) {
    try {
      return await this.emailservice.sendEmail(job.data);
    } catch (error) {
      console.log('Erreur queue:', error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<EmailsendDto>) {
    console.log(`Job for ${job.data.to} completed`);
  }
}
