import { CONFIRM_FORGOT_PASSWORD, CONFIRM_REGISTRATION, MAIL_QUEUE } from '@common/constants/mail.const';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import LogService from 'src/config/log.service';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue,
    private readonly _configService: ConfigService,
  ) {}

  public async sendConfirmationEmailRegister(email: string, username: string, url: string): Promise<void> {
    try {
      await this._mailQueue.add(CONFIRM_REGISTRATION, {
        email,
        username,
        url: url,
      });
    } catch (error) {
      LogService.logErrorFile(error);
      throw new InternalServerErrorException();
    }
  }

  public async sendConfirmationEmailForgot(email: string, username: string, url: string): Promise<void> {
    try {
      await this._mailQueue.add(CONFIRM_FORGOT_PASSWORD, {
        email,
        username,
        url: url,
      });
    } catch (error) {
      LogService.logErrorFile(error);
      throw new InternalServerErrorException();
    }
  }
}
