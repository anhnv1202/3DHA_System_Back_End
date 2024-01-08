import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';

@Module({
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
