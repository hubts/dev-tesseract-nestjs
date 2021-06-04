import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { createWorker, RecognizeResult } from 'tesseract.js'; // npm install --save tesseract.js
import sizeOf from 'image-size'; // npm install --save @types/image-size
import sharp = require('sharp'); // npm install --save sharp

import { RECOGNIZE_OCR_LANGUAGE, RESIZE_IMAGEPATH_SUFFIX, RESIZE_MAXHEIGHT, RESIZE_MAXWIDTH } from './tesseract.constant';

@Injectable()
export class TesseractService {
  private readonly logger = new Logger(TesseractService.name);

  private async resizeAndFocusImage(
    eachImagePath: string,
    targetLocation: string
  ): Promise<{resizedImagePath: string, locatedRectangle: Object}> {
    const imageDimension = sizeOf(eachImagePath);
    const resizedWidth = imageDimension.width > RESIZE_MAXWIDTH ? imageDimension.width : RESIZE_MAXWIDTH;
    const resizedHeight = imageDimension.height > RESIZE_MAXHEIGHT ? imageDimension.height : RESIZE_MAXHEIGHT;
    const resizedImagePath = eachImagePath + RESIZE_IMAGEPATH_SUFFIX;
    await sharp(eachImagePath).resize(resizedWidth, resizedHeight).png({ quality: 100 }).toFile(resizedImagePath);
    this.logger.log('Image resizing: ' + imageDimension.width + ' * ' + imageDimension.height + ' -> ' + resizedWidth + ' * ' + resizedHeight);
    
    // Matching the 'KEY', File value and Option can be matched
    // Then, specific location (rectangle) can be used to recognize
    let locatedRectangle = {
      left: 0,
      top: 0,
      width: resizedWidth,
      height: resizedHeight
    };
    if (targetLocation) {
      locatedRectangle = {
        left: targetLocation.includes('right') ? Math.floor(resizedWidth * 0.5) : 0,
        top: targetLocation.includes('bottom') ? Math.floor(resizedHeight * 0.5) : 0,
        width: targetLocation.includes('left') || targetLocation.includes('right') ? Math.ceil(resizedWidth * 0.5) : resizedWidth,
        height: targetLocation.includes('top') || targetLocation.includes('bottom') ? Math.ceil(resizedHeight * 0.5) : resizedHeight
      }
    }

    return Object.assign({
      resizedImagePath: resizedImagePath,
      locatedRectangle: locatedRectangle
    });
  }

  public async getRecognizedTexts(
    uploadedImages: Array<Express.Multer.File>,
    uploadedImagesOptions: {}
  ): Promise<string[]> {
    const recoginzedTextsArray: string[] = [];
    if (uploadedImages !== null && uploadedImages.length > 0) {
      this.logger.log(uploadedImages.length + ' file(s) is(are) uploaded.');

      for (const eachImage of uploadedImages) {
        let targetLocation: string;
        if (eachImage.fieldname !== '' && eachImage.fieldname in uploadedImagesOptions) {
          targetLocation = uploadedImagesOptions[eachImage.fieldname];
        }
        const resizedImage = await this.resizeAndFocusImage(eachImage.path, targetLocation);
        const recognizedText = await this.recognizeTextFromImage(resizedImage.resizedImagePath, RECOGNIZE_OCR_LANGUAGE, resizedImage.locatedRectangle);
        recoginzedTextsArray.push(recognizedText);
      }
      return recoginzedTextsArray;
    }
    else {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'At least 1 image file must be uploaded.'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async recognizeTextFromImage(imgPath: string, lang: string, locatedRectangle: any): Promise<string> {
    let recognizedText = 'undefined';
    const ocrLangDataPath = './src/tesseract/langs';

    // OCR recognition
    const ocrWorker = createWorker({
      langPath: ocrLangDataPath, // path for downloading(loading) langs pack
      cachePath: ocrLangDataPath, // path for cache data after working
      gzip: false // loaded data file extension (.traineddata, not .gz)
    });
    await ocrWorker.load();
    await ocrWorker.loadLanguage(lang);
    await ocrWorker.initialize(lang);
    /*
      You can use this to set whitelist in language:
      await ocrWorker.setParameters({
        tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyz'
      });
    */

    let recognizeResult: RecognizeResult;
    if (locatedRectangle !== null) {
      recognizeResult = await ocrWorker.recognize(imgPath, { rectangle: locatedRectangle });
    } else {
      recognizeResult = await ocrWorker.recognize(imgPath);
    }
    await ocrWorker.terminate();

    recognizedText = recognizeResult.data.text;
    recognizedText = recognizedText.replace(new RegExp('\r?\n','g'), ' ');
    recognizedText = recognizedText.replace(new RegExp(' +', 'g'), ' ');
    return recognizedText;
  }
}
