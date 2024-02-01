import { Lesson, LessonSchema } from '@models/lesson.model';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonController } from './lesson.controller';
import { LessonsRepository } from './lesson.repository';
import { LessonService } from './lesson.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]), ChapterModule],
  controllers: [LessonController],
  providers: [LessonsRepository, LessonService],
  exports: [LessonsRepository, LessonService],
})
export class LessonModule {}
