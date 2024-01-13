// import { Pagination, PaginationResult } from '#common/interfaces/filter.interface';
// import { ItemNotFoundMessage, findAndCount } from '#common/utils/helper.utils';
// import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CreateMultiUserDTO, UserDTO } from 'src/dto/user.dto';
// import { ChangeActiveCorporation, ChangeStatus } from 'src/dto/index.dto';
// import {
//   ACCOUNT_STATUS_CODE,
//   SOURCE_STATUS_VALID,
//   Roles,
//   SEARCH_BY,
//   ACCOUNT_STATUS_NAME,
// } from '#common/constants/global.const';
// import { BatchResult } from '#common/interfaces/index.interface';
import { CLOUDINARY_USER_AVATAR_IMG, DEFAULT_AVATAR, Roles, SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { User } from '@models/user.model';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChangeActiveDTO } from 'src/dto/common.dto';
import { UpdateUserDTO } from 'src/dto/user.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private cloudinaryService: CloudinaryService,
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

  async getOneBy(data: Partial<User>): Promise<User | null> {
    return await this.userRepository.findOne({ data });
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
    const { avatar, lastName, firstName } = data;
    let image = existUser.avatar;
    if (avatar && avatar !== existUser.avatar) {
      if (DEFAULT_AVATAR !== existUser.avatar && existUser.avatar)
        await this.cloudinaryService.deleteFile(existUser.avatar, CLOUDINARY_USER_AVATAR_IMG);

      image = (await this.cloudinaryService.uploadImage(avatar, CLOUDINARY_USER_AVATAR_IMG)).imageUrl;
    }

    return await this.updateOneBy(id, {
      ...data,
      avatar: image,
      ...(lastName && firstName && { name: `${lastName} ${firstName}`.trim() }),
    });
  }
}
