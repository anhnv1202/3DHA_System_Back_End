import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './../../models/bill.model';
import { BillController } from './bill.controller';
import { BillsRepository } from './bill.repository';
import { BillService } from './bill.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }])],
  controllers: [BillController],
  providers: [BillsRepository, BillService],
  exports: [BillsRepository, BillService],
})
export class BillModule {}
