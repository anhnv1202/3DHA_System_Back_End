import { RoleEnum } from '@common/enums/role.enum';
import { Role } from '@models/role.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

@Injectable()
export class RolesSeeder implements Seeder {
  constructor(@InjectModel(Role.name) private readonly role: Model<Role>) {}

  async seed(): Promise<any> {
    const roles = await this.role.find();

    if (roles.length === 0) {
      const data = [
        {
          name: 'Translator',
          code: RoleEnum.T,
        },
        {
          name: 'Project Manager',
          code: RoleEnum.PM,
        },
      ];
      return this.role.insertMany(data);
    } else {
      console.log('data already exists');
    }
  }

  async drop(): Promise<any> {
    return this.role.deleteMany({});
  }
}
