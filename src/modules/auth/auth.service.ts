import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { User } from '@models/user.model';
import { MailService } from '@modules/mail/mail.service';
import { TokensRepository } from '@modules/token/token.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ChangePasswordDTO, ForgotPasswordDTO, LoginDTO, RegisterDTO, SuccessResponseDTO } from 'src/dto/auth.dto';

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

  async register(body: RegisterDTO, request: any): Promise<SuccessResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { password, rePassword, username, email, phone } = body;
      if (password !== rePassword) throw new InternalServerErrorException('auth-password-not-same');
      const user = await this.userRepository.create({ username, password, email, phone });
      const token = this.jwt.sign(
        { id: user._id, role: user.role, status: user.status },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: 10 * 60 * 1000 },
      );

      this.tokenRepository.create({
        token,
        expire: new Date(Date.now() + 10 * 60 * 1000),
      });

      this._mailService.sendConfirmationEmailRegister(
        body.email,
        body.username,
        `${request.get('origin')}/confirm?token=${token}&type=register`,
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

  async login({ password, email }: LoginDTO) {
    const user = await this.userService.verifyUser(email);
    const isMatch = await user.isValidPassword(password);
    if (!user || !user.status || !isMatch) {
      throw new InternalServerErrorException('login-fail');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: dummy, ...rest } = user;

    const accessToken = this.jwt.sign(rest, { secret: process.env.JWT_SECRET_KEY, expiresIn: '24h' });
    return { accessToken, user: rest };
  }

  async confirm(token: string, request: any): Promise<SuccessResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const tokenExisted = await this.tokenRepository.findOne({ token });

      if (!tokenExisted) {
        throw new HttpException({ status: HttpStatus.FOUND, url: `${request.get('origin')}/login` }, HttpStatus.FOUND);
      }

      const { id, status } = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });

      if (status) {
        throw new BadRequestException('access-denied');
      }

      const crUser = await this.userService.getOne(id);

      if (!crUser) {
        throw new BadRequestException(ItemNotFoundMessage('crUser'));
      }

      await this.tokenRepository.remove(tokenExisted._id);
      await this.userRepository.update(crUser.id, { status: true });

      await session.commitTransaction();

      return { status: true };
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async forgotPassword(body: ForgotPasswordDTO, request: any): Promise<SuccessResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { email } = body;
      const user = await this.userRepository.findOne({ email });

      if (!user || user.email !== email) {
        throw new InternalServerErrorException('forgot-password');
      }

      const token = this.jwt.sign(
        { id: user._id, role: user.role, email, status: user.status },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: 10 * 60 * 1000 },
      );
      this.tokenRepository.create({
        token,
        expire: new Date(Date.now() + 10 * 60 * 1000),
      });
      this._mailService.sendConfirmationEmailForgot(
        email,
        user.username,
        `${request.get('origin')}/confirm?token=${token}&type=forgotPassword`,
      );
      await session.commitTransaction();
      return { status: true };
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async changePassword(body: ChangePasswordDTO, user: User, request: any) {
    const { oldPassword, newPassword, confirmPassword, token } = body;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (token) {
        const tokenExisted = await this.tokenRepository.findOne({ token });

        if (!tokenExisted) {
          throw new HttpException(
            { status: HttpStatus.FOUND, url: `${request.get('origin')}/login` },
            HttpStatus.FOUND,
          );
        }
        const { id } = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });
        const crUser = await this.userService.getOne(id);

        if (newPassword !== confirmPassword) throw new BadRequestException('auth-password-not-correct');

        if (newPassword === crUser.password) throw new BadRequestException('validation-old-password-equal');

        return await this.userRepository.update(crUser._id, { ...crUser, password: newPassword });
      }

      const crUser = await this.userService.getOne(user._id);
      if (!crUser) {
        throw new BadRequestException(ItemNotFoundMessage('loginId'));
      }
      const isMatch = await crUser.isValidPassword(oldPassword);
      if (!isMatch) {
        throw new InternalServerErrorException('auth-password-not-correct');
      }

      if (newPassword !== confirmPassword) {
        throw new InternalServerErrorException('auth-password-not-same');
      }
      await session.commitTransaction();
      return await this.userRepository.update(crUser.id, { password: newPassword });
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
