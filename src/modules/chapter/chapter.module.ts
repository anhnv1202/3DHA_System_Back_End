import { ChaptersRepository } from './chapter.respository';
import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { CourseModule } from '@modules/course/course.module';
import { Chapter, ChapterSchema } from '@models/chapter.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]), CourseModule],
  controllers: [ChapterController],
  providers: [ChaptersRepository, ChapterService],
  exports: [ChaptersRepository, ChapterService],
})
export class ChapterModule {}
