import { Rating, RatingSchema } from '@models/rating.model';
import { CourseModule } from '@modules/course/course.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from './rating.controller';
import { RatingsRepository } from './rating.repository';
import { RatingService } from './rating.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]), CourseModule],
  controllers: [RatingController],
  providers: [RatingsRepository, RatingService],
  exports: [RatingsRepository, RatingService],
})
export class RatingModule {}
