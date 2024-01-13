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
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ChangeActiveDTO } from 'src/dto/common.dto';
import { UpdateUserDTO } from 'src/dto/user.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    @InjectConnection()
    private readonly connection: Connection,
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

  //   async getAll(pagination: Pagination, user: User): Promise<PaginationResult<User>> {
  //     const { isManager } = pagination;
  //     const isSuperAdmin = this.isSuperAdmin(user);

  //     const querySuperAdmin = {
  //       role: isManager ? [Roles.SALE, Roles.SUPPORT_SALE] : [Roles.EMPLOYEE],
  //     };

  //     const querySale = {
  //       role: [Roles.EMPLOYEE],
  //       corporationId: user.corporationId,
  //     };

  //     const paginationBuilder = isSuperAdmin ? querySuperAdmin : querySale;

  //     try {
  //       const [data, total] = await findAndCount<User>({
  //         pagination: { ...pagination, ...paginationBuilder },
  //         searchBy: SEARCH_BY.USER,
  //         relations: ['company', 'corporation'],
  //         entityManager: this.usersRepository.manager,
  //         entity: User,
  //       });

  //       return { data, total };
  //     } catch (e) {
  //       throw new InternalServerErrorException('query-invalid', e);
  //     }
  //   }

  //   async getOne(id: string): Promise<User | null> {
  //     return await this.usersRepository.findOneBy({ id });
  //   }

  //   async update(body: UserDTO, id: string): Promise<User> {
  //     const res = await this.usersRepository.findOne({ where: { id }, relations: { company: true, corporation: true } });
  //     if (!res) throw new InternalServerErrorException('company-not-found');

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password, ...rest } = body;

  //     if (res.status === ACCOUNT_STATUS_CODE.TEMPREGISTER) {
  //       res.status = ACCOUNT_STATUS_CODE.OFFICIALREGISTER;
  //       res.statusName = ACCOUNT_STATUS_NAME[ACCOUNT_STATUS_CODE.OFFICIALREGISTER];
  //     }

  //     try {
  //       return this.usersRepository.save(new User(Object.assign(res, rest)));
  //     } catch (e) {
  //       throw new InternalServerErrorException(e);
  //     }
  //   }

  //   async save(user: Partial<User>): Promise<User> {
  //     return await this.usersRepository.save(user);
  //   }

  //   async create(user: UserDTO): Promise<User> {
  //     const { companyId, corporationId, role, id } = user;
  //     const cn = this.dataSource.createQueryRunner();
  //     await cn.connect();
  //     try {
  //       if (role > Roles.EMPLOYEE && !id) {
  //         throw new BadRequestException(ItemNotFoundMessage('loginId'));
  //       }

  //       await cn.startTransaction();

  //       const company = await this.company.findOneBy({ id: companyId });
  //       if (company.corporationId !== corporationId) {
  //         throw new BadRequestException('CompanyId is Not valid');
  //       }

  //       if (role === Roles.EMPLOYEE) {
  //         user.id = `${corporationId}-${companyId}-${company.userNumber}`;
  //         await this.company.save({ ...company, userNumber: company.userNumber + 1 });
  //       }

  //       return await this.usersRepository.save(new User(user));
  //     } catch (e) {
  //       throw new InternalServerErrorException(e);
  //     }
  //   }

  //   async createMulti({ corporationId }: CreateMultiUserDTO): Promise<User[]> {
  //     const companyList = await this.company.find({ where: { corporationId }, relations: { corporation: true } });
  //     const connect = this.dataSource.createQueryRunner();
  //     await connect.connect();
  //     await connect.startTransaction();

  //     const user = companyList.map(
  //       (company) =>
  //         new User({
  //           id: `${company.corporationId}-${company.id}-${company.userNumber + 1}`,
  //           password: this.generatePassword(),
  //           role: Roles.EMPLOYEE,
  //           companyId: company.id,
  //           corporationId: company.corporationId,
  //         }),
  //     );

  //     try {
  //       await this.company.save(companyList.map((i) => ({ ...i, userNumber: i.userNumber + 1 })));
  //       const res = await this.usersRepository.save(user);
  //       return res;
  //     } catch (e) {
  //       await connect.rollbackTransaction();
  //       throw new InternalServerErrorException(e);
  //     } finally {
  //       await connect.release();
  //     }
  //   }

  //   async updateOne(user: User): Promise<User> {
  //     try {
  //       return await this.usersRepository.save(user);
  //     } catch (e) {
  //       throw new InternalServerErrorException(e);
  //     }
  //   }

  //   async changeStatus(body: ChangeStatus): Promise<BatchResult | null> {
  //     const { isAll, listId, status } = body;

  //     // const all = await this.usersRepository.find({});

  //     // if (!listId.length) {
  //     //   await this.usersRepository.save(
  //     //     all.map((e) => ({ ...e, status: 0, statusName: ACCOUNT_STATUS_NAME[0], branch: 'Tokyo' })),
  //     //   );
  //     //   // await this.usersRepository.save(all.map((e) => ({ ...e, status: 0, statusName: ACCOUNT_STATUS_NAME[0] })));
  //     //   return null;
  //     // }

  //     if (
  //       ![ACCOUNT_STATUS_CODE.TEMPREGISTER, ACCOUNT_STATUS_CODE.EXITMEMBERSHIP, ACCOUNT_STATUS_CODE.DELETED].includes(
  //         status,
  //       )
  //     ) {
  //       throw new InternalServerErrorException('query-invalid', 'account-status');
  //     }

  //     if (!isAll) {
  //       if (!listId.length) throw new InternalServerErrorException('query-invalid', 'account-status');

  //       const [users, total] = await this.usersRepository.findAndCount({ where: { id: In(listId) } });
  //       const valid = [];
  //       const invalid = [];

  //       users.forEach((user) => {
  //         if (user.status === SOURCE_STATUS_VALID[status]) {
  //           valid.push({ ...user, status, statusName: ACCOUNT_STATUS_NAME[status] });
  //           return;
  //         }

  //         invalid.push(user);
  //       });
  //       await this.usersRepository.save(valid);

  //       return {
  //         total,
  //         errors: invalid.map((i) => ({ name: i.id, error: i.statusName })),
  //       };
  //     }

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const [_, total] = await this.usersRepository.findAndCount();
  //     const [valid] = await this.usersRepository.findAndCount({
  //       where: { status: SOURCE_STATUS_VALID[status] },
  //     });
  //     const [inValid] = await this.usersRepository.findAndCount({
  //       where: { status: Not(SOURCE_STATUS_VALID[status]) },
  //     });

  //     await this.usersRepository.save(valid.map((i) => ({ ...i, status, statusName: ACCOUNT_STATUS_NAME[status] })));

  //     return {
  //       total,
  //       errors: inValid.map((i) => ({ name: i.id, error: i.statusName })),
  //     };
  //   }

  //   generatePassword(): string {
  //     return Math.random().toString(36).slice(-8);
  //   }

  //   private isSuperAdmin(user: User): boolean {
  //     return user.role === Roles.SUPER_ADMIN;
  //   }
}
