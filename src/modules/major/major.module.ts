import { Module } from '@nestjs/common';
import { MajorController } from './major.controller';
import { MajorService } from './major.service';
import { MajorsRepository } from './major.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Major, MajorSchema } from '@models/major.models';

@Module({
  imports: [MongooseModule.forFeature([{ name: Major.name, schema: MajorSchema }])],
  controllers: [MajorController],
  providers: [MajorsRepository, MajorService],
  exports: [MajorsRepository, MajorService],
})
export class MajorModule {}
