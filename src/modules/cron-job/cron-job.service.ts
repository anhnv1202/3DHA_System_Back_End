// import { EXPORT_DIR, TMP_DIR } from '@common/constants/file.const';
// import { ONE_DAY_TO_MS } from '@common/constants/global.const';
import { CRON_EXPRESSION } from '@common/constants/cron-job.const';
import { handleLogInfo } from '@common/utils/helper.utils';
import { TokenService } from '@modules/token/token.service';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronJobService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @Cron(CRON_EXPRESSION.MIDNIGHT_EVERY_DAY)
  async deleteExpiredTokensJob() {
    handleLogInfo('DELETE_EXPIRED_TOKENS_JOB_AND_USER_NOT_CONFIRM is running');
    await this.tokenService.deleteExpiredTokens();
    await this.userService.deleteUserNotConfirm();
    handleLogInfo('DELETE_EXPIRED_TOKENS_JOB_AND_USER_NOT_CONFIRM');
  }
}
