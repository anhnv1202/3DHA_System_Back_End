import { User, UserSchema } from '@models/user.model';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UsersRepository } from './user.repository';
import { UserService } from './user.service';
import { FileModule } from '@modules/file/file.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), FileModule],
  controllers: [UserController],
  providers: [UsersRepository, UserService],
  exports: [UsersRepository, UserService],
})
export class UserModule {}
