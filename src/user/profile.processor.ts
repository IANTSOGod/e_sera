import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpException } from '@nestjs/common';
import { Job } from 'bullmq';
import { ProfileWithMulterDto } from 'src/interfaces/dto/profilephoto.dto';
import { Uploadmqdto } from 'src/interfaces/dto/uploadmq.dto';
import { UserService } from './user.service';

@Processor('user-upload')
export class ProfileProcessor extends WorkerHost {
  constructor(private readonly userservice: UserService) {
    super();
  }

  async process(job: Job<Uploadmqdto>) {
    try {
      const fileData = {
        email: job.data.email,
        file: {
          buffer: Buffer.from(job.data.photo64, 'base64'),
          fieldname: job.data.fieldname,
          originalname: job.data.originalname,
          encoding: job.data.encoding,
          mimetype: job.data.mimetype,
          size: job.data.size,
        },
      };
      await this.userservice.updateProfile(fileData);
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: 'Job processor error' }, 500);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ProfileWithMulterDto>) {
    console.log(`Job for ${job.data.email} completed`);
  }
}
