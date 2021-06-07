import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TesseractService } from './tesseract.service';
import fs from 'fs';

describe('TesseractService', () => {
  let service: TesseractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TesseractService],
    }).compile();

    service = module.get<TesseractService>(TesseractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Inner: recognize() in default', () => {
    it('should recognize texts from 2 test images.', async () => {
      // This test can be deprecated or rejected because of randomness of test recognition.
      const testImagePath1 = './test-example/test_kor.png';
      const expectedText1 = '이 서체는 맑은 고딕입니다 가나다라마바사 아자사카타파하';
      const recognizedText1 = await service.recognize(testImagePath1, 'kor', null);
      expect(recognizedText1.trim()).toEqual(expectedText1);

      const testImagePath2 = './test-example/test_eng.png';
      const expectedText2 = 'Tesseract amazing You can recognize everything Good';
      const recognizedText2 = await service.recognize(testImagePath2, 'eng', null);
      expect(recognizedText2.trim()).toEqual(expectedText2);
    });
  });

  describe('Good: recognizeTextFromImage()', () => {
    it('should recognize text from 1 test image.', async () => {
      const testImagePath1 = './test-example/test_kor.png';
      const testObject = {
        fieldname: '',
        path: testImagePath1
      }
      const expectedText1 = '이 서체는 맑은 고딕입니다 가나다라마바사 아자차카타파하';
      const recognizedText1 = await service.recognizeTextFromImage([testObject], null);
      expect(recognizedText1[0].trim()).toEqual(expectedText1);
    });
  });

  describe('Error: recognizeTextFromImage()', () => {
    it('should throw 404 error if there is no uploaded file.', async () => {
      try {
        await service.recognizeTextFromImage(null, {});
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.response.statusCode).toBe(404);
        expect(e.response.error).toBe('At least 1 image file must be uploaded.');
      }
    });
  });
});
