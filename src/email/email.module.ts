import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailProcesssor } from './email.processor';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailProcesssor],
  exports: [EmailService],
})
export class EmailModule {}
