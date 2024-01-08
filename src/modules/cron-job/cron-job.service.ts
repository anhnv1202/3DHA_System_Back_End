// import { EXPORT_DIR, TMP_DIR } from '@common/constants/file.const';
// import { ONE_DAY_TO_MS } from '@common/constants/global.const';
import { CRON_EXPRESSION } from '@common/constants/cron-job.const';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronJobService {
  constructor(private configService: ConfigService) {}

  @Cron(CRON_EXPRESSION.MIDNIGHT_EVERY_DAY)
  deleteTmpAndExportFileJob() {
    // handleLogInfo('DELETE_TMP_N_EXPORT_FILE_JOB is running');
    // removeFileOrFolder(
    //   TMP_DIR,
    //   this.configService.get('DELETE_TMP_FILE_DATEDIFF') * ONE_DAY_TO_MS,
    // );
    // removeFileOrFolder(
    //   EXPORT_DIR,
    //   this.configService.get('DELETE_TMP_FILE_DATEDIFF') * ONE_DAY_TO_MS,
    // );
    // handleLogInfo('DELETE_TMP_N_EXPORT_FILE_JOB is complete');
  }
}
