import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { UserModule } from '@modules/user/user.module';
import { CourseModule } from '@modules/course/course.module';

@Module({
  imports: [UserModule,CourseModule],
  controllers: [WishlistController],
  providers: [WishlistService]
})
export class WishlistModule {}
