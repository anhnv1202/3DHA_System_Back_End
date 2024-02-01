import { Chapter, ChapterSchema } from '@models/chapter.model';
import { CourseModule } from '@modules/course/course.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterController } from './chapter.controller';
import { ChaptersRepository } from './chapter.repository';
import { ChapterService } from './chapter.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]), CourseModule],
  controllers: [ChapterController],
  providers: [ChaptersRepository, ChapterService],
  exports: [ChaptersRepository, ChapterService],
})
export class ChapterModule {}
