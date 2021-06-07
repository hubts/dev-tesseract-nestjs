# Image Recognition using Tesseract in NestJS

## Description

OCR (Optical character recognition) is a technology which scans images to recognize texts of them. `Tesseract` is a library of OCR engine which is a __free__ and also have a __nice recognition__ rate.

We develop an API in __NestJS__ using `tesseract.js` which is a javascript version of `Tesseract`. The API contains an example usage of `tesseract.js` in language, Korean and English, via uploading image files to be recognized. Furthermore, we develop __specific area recognition__ within 4-area (top-left, top-right, bottom-left, and bottom-right).

## Dependency

~~~bash
npm install
~~~

Main dependencies are also commented in codes. We can use them.

## Run

~~~bash
npm run start
~~~

## Test

~~~bash
npm run test
~~~

We have some unit tests to experience OCR as examples.

## Config

See `tesseract.constant.ts`.

## How to use API with Postman

When we start the codes, NestJS server runs with port number 3000 in default. Now, we can `POST` to API.

| Name         | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| API          | [http://localhost:3000/tesseract/upload](http://localhost:3000/tesseract/upload) |
| Method       | POST                                                         |
| Content-Type | multipart/form-data                                          |

In `Body`, image files must be uploaded and options can be appended. Uploading image files without any options are recognized in all areas. If match `KEY` between of files and data, the data is used as an option.

Here is an example in body of uploading 2 image files.

| Key  | Value        | Mandatory |
| ---- | ------------ | --------- |
| book | book.png     | Mandatory |
| book | top-left     | Optional  |
| code | code.jpg     | Mandatory |
| code | bottom-right | Optional  |

Then, `top-left` of `book.png` is recognized and `bottom-right` of `code.jpg` is recognized, respectively.

## Comment

If recognized results are ridiculous, you can doubt resizing of images. 'Resizing' can export incorrect results. It is recommended that you should check the images by adding an extension(.png) to the uploaded file in 'upload' directory.

## Reference

[1] [Github naptha/tesseract.js](https://github.com/naptha/tesseract.js/blob/90466c3b5504a9220ba0ff91ccec22003f72cbd2/docs/api.md#worker-load-language)

[2] [Github naphta/tesseract.js API](https://github.com/naptha/tesseract.js/blob/90466c3b5504a9220ba0ff91ccec22003f72cbd2/docs/api.md#worker-load-language)

[3] [OCR 라이브러리 Tesseract.js 사용해보기](https://miryang.dev/2019/04/13/tesseractjs-tutorial/)

