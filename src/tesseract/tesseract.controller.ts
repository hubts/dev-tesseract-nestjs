import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { LIMIT_FILES, LIMIT_FILESIZE } from './tesseract.constant';
import { diskStorageDestination, diskStorageFilename, imageFileFilter } from './tesseract.util';
import { diskStorage } from 'multer'; // npm install --save @types/multer
import { TesseractService } from './tesseract.service';

@Controller('tesseract')
export class TesseractController {
  constructor(
    private readonly tesseractService: TesseractService
  ) { }

  /* 
    Expect:
    uploaded files are Image, preferably (.PNG) with nice resolution
    and have (1 : 1.414) ratio in size such like A4 paper.
  */
  @UseInterceptors(AnyFilesInterceptor({
    fileFilter: imageFileFilter,
    storage: diskStorage({ destination: diskStorageDestination, filename: diskStorageFilename }),
    limits: { files: LIMIT_FILES, fileSize: LIMIT_FILESIZE }
  }))
  @Post('upload')
  public uploadRealtyFileToRecognize(@Body() requestBody: {}, @UploadedFiles() uploadedImages: Array<Express.Multer.File>) {
    /*
      Form-data has key-value pairs as inputs.
      Match the 'key's between uploaded file (value) and option (value) of it.
      Then, specific area in the image would be recognized.
    */
    const uploadedImagesOptions = Object.assign({}, requestBody);
    const uploadedImagesArray: Array<{
      fieldname: string,
      path: string
    }> = [];
    for (const eachImage of uploadedImages) {
      const eachImageFields = {
        fieldname: eachImage.fieldname,
        path: eachImage.path
      }
      uploadedImagesArray.push(eachImageFields);
    }
    return this.tesseractService.recognizeTextFromImage(uploadedImagesArray, uploadedImagesOptions);
  }
}

