import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TesseractService } from './tesseract.service';

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

  describe('recognizeTextFromImage()', () => {
    it('should recognize the text in 2 test image.', async () => {
      // This test can be deprecated or rejected because of randomness of test recognition.
      const testImagePath1 = './test-example/test_kor.png';
      const expectedText1 = '가나다라마바사 : 나눔명조';
      const recognizedText1 = await service.recognizeTextFromImage(testImagePath1, 'kor', null);
      expect(recognizedText1.trim()).toEqual(expectedText1);

      const testImagePath2 = './test-example/test_eng.png';
      const expectedText2 = 'Tesseract amazing You can recognize everything Good';
      const recognizedText2 = await service.recognizeTextFromImage(testImagePath2, 'eng', null);
      expect(recognizedText2.trim()).toEqual(expectedText2);
    });
  });

  describe('getRecognizedTexts()', () => {
    it('should throw 404 error if there is no uploaded file.', async () => {
      try {
        await service.getRecognizedTexts(null, {});
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.response.statusCode).toBe(404);
        expect(e.response.error).toBe('At least 1 image file must be uploaded.');
      }
    });
  });
});
