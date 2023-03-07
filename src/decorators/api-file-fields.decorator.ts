import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type UploadFields = MulterField & { required?: boolean };

export function ApiFileFields(
  uploadsFields: UploadFields[],
  localOptions?: MulterOptions,
) {
  const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
    Object.assign(
      {},
      ...uploadsFields.map((field) => ({
        [field.name]: { type: 'string', format: 'binary' },
      })),
    );
  const apiBody = ApiBody({
    schema: {
      type: 'object',
      properties: bodyProperties,
      required: uploadsFields
        .filter((field) => field.required)
        .map((field) => field.name),
    },
  });
  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadsFields, localOptions)),
    ApiConsumes('multipart/form-data'),
    apiBody,
  );
}
