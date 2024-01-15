import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CoursesRepository } from './course.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '@models/course.models';

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
  controllers: [CourseController],
  providers: [CoursesRepository,CourseService],
  exports: [CoursesRepository, CourseService],
})
export class CourseModule {}
