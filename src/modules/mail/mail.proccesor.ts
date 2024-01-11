import { CONFIRM_FORGOT_PASSWORD, CONFIRM_REGISTRATION, MAIL_QUEUE } from '@common/constants/mail.const';
import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import LogService from 'src/config/log.service';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(private readonly _mailerService: MailerService) {}

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<{ email: string; url: string; username: string }>) {
    LogService.logInfo(`Sending confirm registration email to '${job.data.email}'`);
    try {
      return await this._mailerService.sendMail({
        to: job.data.email,
        from: '"Support Team" <support@example.com>',
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './registration.template.hbs',
        context: {
          username: job.data.username,
          url: job.data.url,
        },
      });
    } catch {
      LogService.logErrorFile(`Failed to send confirmation email to '${job.data.email}'`);
    }
  }

  @Process(CONFIRM_FORGOT_PASSWORD)
  public async confirmForgotPassword(job: Job<{ email: string; url: string; username: string }>) {
    LogService.logInfo(`Sending confirm registration email to '${job.data.email}'`);
    try {
      return await this._mailerService.sendMail({
        to: job.data.email,
        from: '"Support Team" <support@example.com>',
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './forgot-password.template.',
        context: {
          username: job.data.username,
          url: job.data.url,
        },
      });
    } catch {
      LogService.logErrorFile(`Failed to send confirmation email to '${job.data.email}'`);
    }
  }

  @OnQueueActive()
  public onActive(job: Job) {
    LogService.logInfo(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    LogService.logInfo(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    LogService.logErrorFile(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }
}
