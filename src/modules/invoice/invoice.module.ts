import { Invoice, InvoiceSchema } from '@models/invoice.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './invoice.controller';
import { InvoicesRepository } from './invoice.repository';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])],
  controllers: [InvoiceController],
  providers: [InvoicesRepository, InvoiceService],
  exports: [InvoicesRepository, InvoiceService],
})
export class InvoiceModule {}
