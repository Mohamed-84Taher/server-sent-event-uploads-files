import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileMimetypeFilter } from 'src/filters/file-mimetype-filter';

export function ApiFile(
  fieldName: string = 'file',
  required: boolean = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function ApiImageFile(
  fieldName: string = 'image',
  required: boolean = false,
) {
  return ApiFile(fieldName, required, {
    fileFilter: fileMimetypeFilter('image'),
  });
}

export function ApiPdfFile(
  fieldName: string = 'document',
  required: boolean = false,
) {
  return ApiFile(fieldName, required, {
    fileFilter: fileMimetypeFilter('pdf'),
  });
}
