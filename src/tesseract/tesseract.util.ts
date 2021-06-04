import { HttpException, HttpStatus } from '@nestjs/common';
import fs = require('fs');
import { extname } from 'path';

export const diskStorageDestination = (req: any, file: any, callback: any) => {
  // Location of uploaded file
  const dir = './upload';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  callback(null, dir);
}

export const diskStorageFilename = (req: any, file: any, callback: any) => {
  const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
  const fieldname = file.fieldname === '' ? 'img' : file.fieldname.trim();
  callback(null, fieldname + '_' + uniqueSuffix);
}

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: `Unsupported file type (${extname(file.originalname)}) was uploaded.`
        },
        HttpStatus.BAD_REQUEST
      ),
      false
    );
  }
  callback(null, true);
}