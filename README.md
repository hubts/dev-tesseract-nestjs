# Image Recognition in NestJS

## Description

OCR (Optical character recognition) is a technology which scans images to recognize texts on them.

`Tesseract` is a library of OCR engine which is a free and also have a nice recognition rate.

Here is an API developed in __NestJS__ based on `Tesseract` in javascript, called `tesseract.js`.

The API contains __uploading image files with 4-area recognition.__

4-area recognition is an image recognition on specific area among `top-left`, `top-right`, `bottom-left`, and `bottom-right`.

## Dependency

~~~bash
npm install
~~~

Specific dependencies are commented in codes. Follow them.

## Run

~~~bash
npm run start
~~~

## Test

~~~bash
npm run test
~~~

We have some unit tests to experience OCR.

## Reference

[1] [Github naptha/tesseract.js](https://github.com/naptha/tesseract.js/blob/90466c3b5504a9220ba0ff91ccec22003f72cbd2/docs/api.md#worker-load-language)

[2] [Github naphta/tesseract.js API](https://github.com/naptha/tesseract.js/blob/90466c3b5504a9220ba0ff91ccec22003f72cbd2/docs/api.md#worker-load-language)

[3] [OCR 라이브러리 Tesseract.js 사용해보기](https://miryang.dev/2019/04/13/tesseractjs-tutorial/)

