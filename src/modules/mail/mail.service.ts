import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import LogService from 'src/config/log.service';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendUserConfirmation({ username, email, url }) {
    try {
      await this.mailer.sendMail({
        to: email,
        from: '"Support Team" <support@example.com>',
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './mail.template.hbs',
        context: {
          username: username || email,
          url,
        },
      });
    } catch (e) {
      LogService.logErrorFile(e);
      throw new InternalServerErrorException();
    }
  }
}
