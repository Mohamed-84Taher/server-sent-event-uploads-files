import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ApiFileFields } from 'src/decorators/api-file-fields.decorator';
import { ApiFile } from 'src/decorators/api-file.decorator';
import { ApiFiles } from 'src/decorators/api-files.decorator';
import { fileMimetypeFilter } from 'src/filters/file-mimetype-filter';
import { ParseFile } from 'src/pipes/parse-file.pipe';
import { FileService } from './file.service';
import { extname } from 'path';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @ApiFile('avatar', true, {
    fileFilter: fileMimetypeFilter('image'),
    storage: diskStorage({
      destination: 'uploads/images',
      filename: (req, file, cb) => {
        cb(
          null,
          `${file.fieldname}-${Date.now()}${extname(file.originalname)}`,
        );
      },
    }),
  })
  uploadFile(@UploadedFile(ParseFile) file: Express.Multer.File) {
    console.log(file);
  }

  @Post('uploads')
  @ApiFiles()
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @Post('uploadFields')
  @ApiFileFields(
    [
      { name: 'avatar', maxCount: 1, required: true },
      { name: 'background', maxCount: 1 },
    ],
    {
      fileFilter: fileMimetypeFilter('image'),
      storage: diskStorage({
        destination: 'uploads/documents',
        filename: (req, file, cb) => {
          cb(
            null,
            `${file.fieldname}-${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
    },
  )
  uploadMultipleFiles(@UploadedFiles(ParseFile) files: Express.Multer.File[]) {
    console.log(files);
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads/images',
        filename: (req, file, cb) => {
          cb(
            null,
            `${file.fieldname}-${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadImageProfile(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
  }
}
