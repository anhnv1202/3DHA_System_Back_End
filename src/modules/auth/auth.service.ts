import { TokenType } from '@common/constants/global.const';
import { MailService } from '@modules/mail/mail.service';
import { TokensRepository } from '@modules/token/token.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { UserService } from '@modules/user/user.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RegisterDTO, RegisterResponseDTO } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly _mailService: MailService,
    private readonly _configService: ConfigService,
    private userRepository: UsersRepository,
    private tokenRepository: TokensRepository,
    @InjectConnection()
    private readonly connection: Connection,
    private userService: UserService,
  ) {}

  async register(body: RegisterDTO): Promise<RegisterResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { password, rePassword, username, email, phone } = body;
      if (password !== rePassword) throw new InternalServerErrorException('auth-password-not-same');
      const user = await this.userRepository.create({ username, password, email, phone });
      const token = this.jwt.sign(
        { username: body.username, email: body.email },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: 5 * 60 * 1000 },
      );

      this.tokenRepository.create({
        tokenType: TokenType.CONFIRM_REGISTRATION,
        token,
        createdBy: user._id,
        expire: new Date(Date.now() + 5 * 60 * 1000),
      });

      this._mailService.sendConfirmationEmail(
        body.email,
        body.username,
        `${this._configService.get('CLIENT_URL')}/change-password?token=${token}`,
      );
      await session.commitTransaction();
      return { status: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  //   async changePassword(body: ChangePasswordDTO, user: User): Promise<User> {
  //     const { oldPassword, newPassword, confirmPassword, token } = body;
  //     try {
  //       if (token) {
  //         const { id, role } = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });
  //         if (role === ACCOUNT_STATUS_CODE.UNPUBLISHED) throw new BadRequestException('access-denied');
  //         const crUser = await this.userService.getOne(id);

  //         if (newPassword !== confirmPassword) throw new BadRequestException('auth-password-not-correct');

  //         if (newPassword === crUser.password) throw new BadRequestException('validation-old-password-equal');

  //         return await this.userService.save({ ...crUser, password: newPassword });
  //       }

  //       const crUser = await this.userService.getOne(user.id);
  //       if (!crUser) {
  //         throw new BadRequestException(ItemNotFoundMessage('loginId'));
  //       }

  //       const currentStatus = crUser.status;

  //       if (oldPassword !== crUser.password) {
  //         throw new InternalServerErrorException('auth-password-not-correct');
  //       }

  //       if (newPassword !== confirmPassword) {
  //         throw new InternalServerErrorException('auth-password-not-same');
  //       }

  //       const newStatus =
  //         currentStatus === ACCOUNT_STATUS_CODE.UNPUBLISHED ? ACCOUNT_STATUS_CODE.TEMPREGISTER : currentStatus;

  //       return await this.userService.updateOne(
  //         new User({ ...crUser, password: newPassword, status: newStatus, statusName: ACCOUNT_STATUS_NAME[newStatus] }),
  //       );
  //     } catch (e) {
  //       throw new InternalServerErrorException(e);
  //     }
  //   }

  //   async forgotPassword({ email, id }) {
  //     const user = await this.userService.getOne(id);
  //     if (!user || user?.email !== email) {
  //       throw new InternalServerErrorException('auth-forgot-password');
  //     }

  //     const token = this.jwt.sign(
  //       { id: user.id, role: user.role },
  //       { secret: process.env.JWT_SECRET_KEY, expiresIn: 3000 },
  //     );
  //     return { token };
  // const token = this.jwt.sign({ email, id: user.id }, { secret: process.env.JWT_SECRET_KEY, expiresIn: 10 });
  // const url = `${request.get('origin')}/auth?token=${token}`;
  // const res = await new Promise(async (res, rej) => {
  //   try {
  //     await promiseHelper.delay(MAIL_DELAY);
  //     await this.mail.sendUserConfirmation({ email, username: user.username, url });
  //     res(HttpStatusCode.Ok);
  //   } catch (e) {
  //     LogService.logErrorFile(e);
  //     rej(HttpStatusCode.InternalServerError);
  //   }
  // });

  // if (res === HttpStatusCode.InternalServerError) {
  //   throw new InternalServerErrorException(ItemNotFoundMessage('email'));
  // }

  // return res === HttpStatusCode.Ok;
  //   }

  //   async login({ password, id }: LoginDTO) {
  //     const user = await this.userService.verifyUser(id, password);
  //     if (!user) {
  //       throw new InternalServerErrorException('login-fail');
  //     }

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: dummy, importedAt, deletedAt, ...rest } = user;

  //     const accessToken = this.jwt.sign(rest, { secret: process.env.JWT_SECRET_KEY, expiresIn: '12h' });
  //     return { accessToken, user: rest };
  //   }
}
