import { DEFAULT_AVATAR, GOOGLE_DRIVE_USER_AVATAR_IMG, Roles, SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { User } from '@models/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChangeActiveDTO } from 'src/dto/common.dto';
import { UpdateUserDTO } from 'src/dto/user.dto';
import { UsersRepository } from './user.repository';
import { FileService } from '@modules/file/file.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private fileService: FileService,
  ) {}

  async getAll(pagination: Pagination): Promise<PaginationResult<User>> {
    const [data, total] = await this.userRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.USER,
    });

    return { data, total };
  }

  async role(role: Roles, id: string): Promise<User> {
    return await this.userRepository.update(id, { role: role });
  }

  async getOne(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async getOneBy(data: { [key: string]: any }): Promise<User | null> {
    return await this.userRepository.findOne(data);
  }

  async createOne(data: Partial<User>): Promise<User | null> {
    return await this.userRepository.create({ ...data });
  }

  async updateOneBy(id: string, data: Partial<User>): Promise<User | null> {
    return await this.userRepository.update(id, { ...data });
  }

  async deleteUserNotConfirm(): Promise<void> {
    return await this.userRepository.removeByFilter({
      status: false,
      updatedAt: { $lte: new Date().getDate() - 3 },
    });
  }

  async active(body: ChangeActiveDTO): Promise<User | boolean> {
    if (!body.listId.length) return true;
    return this.userRepository.updateByFilter(
      { _id: { $in: body.listId } },
      { deletedAt: body.isActive ? null : new Date() },
    );
  }

  async update(data: UpdateUserDTO, id: string): Promise<User | null> {
    const existUser = await this.getOne(id);
    if (!existUser) throw new BadRequestException(ItemNotFoundMessage('User'));
    const { lastName, firstName } = data;

    return await this.updateOneBy(id, {
      ...data,
      ...(lastName && firstName && { name: `${lastName} ${firstName}`.trim() }),
    });
  }

  async updateAvatar(avatar: Express.Multer.File, id: string): Promise<User | null> {
    const existUser = await this.getOne(id);

    if (!existUser) throw new BadRequestException(ItemNotFoundMessage('User'));
    if (DEFAULT_AVATAR !== existUser.avatar && existUser.avatar)
      await this.fileService.deleteFileGoogleDrive(existUser.avatar);
    const image = await this.fileService.uploadToGoogleDrive(avatar, GOOGLE_DRIVE_USER_AVATAR_IMG);
    return await this.updateOneBy(id, {
      avatar: image,
    });
  }
}
