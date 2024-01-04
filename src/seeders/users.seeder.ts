import 'dotenv/config';
import { ROLE_PERMISSION } from './../database/models/user.model';
import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

const users = [
  {
    userId: process.env.ADMIN_ACCOUNT,
    permissions: [ROLE_PERMISSION.ADMIN],
    email: `${process.env.ADMIN_ACCOUNT}@vti.com.vn`,
    name: process.env.ADMIN_ACCOUNT,
  },
];

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async seed(): Promise<any> {
    const admin = await this.user.find({ userId: users[0].userId });

    if (admin.length > 0) {
      return this.user.updateOne({ _id: admin[0]._id }, users[0]);
    } else {
      return this.user.create(users);
    }
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({
      userId: { $in: users.map((user) => user.userId) },
    });
  }
}
