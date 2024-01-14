import { TEN_MINUTES } from '@common/constants/global.const';
import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { User } from '@models/user.model';
import { MailService } from '@modules/mail/mail.service';
import { UserService } from '@modules/user/user.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ChangePasswordDTO, ForgotPasswordDTO, LoginDTO, RegisterDTO, SuccessResponseDTO } from 'src/dto/auth.dto';
import { TokenService } from './../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly _mailService: MailService,
    @InjectConnection()
    private readonly connection: Connection,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async register(body: RegisterDTO, request: any): Promise<SuccessResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { password, rePassword, firstName, lastName } = body;
      if (password !== rePassword) throw new InternalServerErrorException('auth-password-not-same');
      const user = await this.userService.createOne({ ...body, name: `${lastName} ${firstName}`.trim() });
      const token = this.jwt.sign(
        { id: user._id, role: user.role, status: user.status },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: 1000 },
      );

      this.tokenService.createOneBy({
        token,
        expiresAt: new Date(Date.now() + 1000),
      });

      this._mailService.sendConfirmationEmailRegister(
        body.email,
        body.username,
        `${request.get('origin')}/login?token=${token}`,
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
    const user = await this.userService.getOneBy({ email });
    const isMatch = user && (await user.isValidPassword(password));
    if (!user?.status || !isMatch) {
      throw new BadRequestException('login-fail');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: dummy, ...rest } = user.toObject();
    const accessToken = this.jwt.sign(rest, { secret: process.env.JWT_SECRET_KEY, expiresIn: '24h' });
    return { accessToken, user: rest };
  }

  async confirm(token: string): Promise<SuccessResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const tokenExisted = await this.tokenService.getOneBy({ token });
      if (!tokenExisted) {
        throw new BadRequestException('token-expired');
      }

      const { id, status } = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });

      if (status) {
        throw new BadRequestException('access-denied');
      }

      const crUser = await this.userService.getOne(id);

      if (!crUser) {
        throw new BadRequestException(ItemNotFoundMessage('crUser'));
      }

      await this.tokenService.removeById(tokenExisted._id);
      await this.userService.updateOneBy(crUser.id, { status: true });

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
      const user = await this.userService.getOneBy({ email });

      if (user?.email !== email) {
        throw new InternalServerErrorException('crUser');
      }

      const token = this.jwt.sign(
        { id: user._id, role: user.role, email, status: user.status },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: TEN_MINUTES },
      );
      this.tokenService.createOneBy({
        token,
        expiresAt: new Date(Date.now() + TEN_MINUTES),
      });
      this._mailService.sendConfirmationEmailForgot(
        email,
        user.username,
        `${request.get('origin')}/change-password?token=${token}`,
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

  async changePassword(body: ChangePasswordDTO, user: User) {
    const { oldPassword, newPassword, confirmPassword, token } = body;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (token) {
        const tokenExisted = await this.tokenService.getOneBy({ token });

        if (!tokenExisted) {
          throw new BadRequestException('token-expired');
        }
        const { id } = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });
        const crUser = await this.userService.getOne(id);

        if (newPassword !== confirmPassword) throw new BadRequestException('auth-password-not-same');

        if (newPassword === crUser.password) throw new BadRequestException('validation-old-password-equal');

        const userRes = await this.userService.updateOneBy(crUser.id, { password: newPassword, status: true });
        await session.commitTransaction();
        return userRes;
      }

      const crUser = await this.userService.getOne(user._id);
      if (!crUser) {
        throw new BadRequestException(ItemNotFoundMessage('crUser'));
      }
      const isMatch = await crUser.isValidPassword(oldPassword);
      if (!isMatch) {
        throw new BadRequestException('auth-password-not-correct');
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('auth-password-not-same');
      }
      const userRes = await this.userService.updateOneBy(crUser.id, { password: newPassword });
      await session.commitTransaction();
      return userRes;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
