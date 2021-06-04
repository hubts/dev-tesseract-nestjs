import { Module } from '@nestjs/common';
import { TesseractService } from './tesseract.service';
import { TesseractController } from './tesseract.controller';

@Module({
  providers: [TesseractService],
  controllers: [TesseractController],
  exports: [TesseractService]
})
export class TesseractModule {}
