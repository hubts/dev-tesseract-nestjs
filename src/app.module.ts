import { Module } from '@nestjs/common';
import { TesseractModule } from './tesseract/tesseract.module';

@Module({
  imports: [TesseractModule]
})
export class AppModule {}
