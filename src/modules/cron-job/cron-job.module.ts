import { TokenModule } from '@modules/token/token.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';

@Module({
  imports: [TokenModule, UserModule],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
