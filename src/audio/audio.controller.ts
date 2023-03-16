import {
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiService } from '../api/api.service';
import { memoryStorage } from 'multer';

@Controller('audio')
export class AudioController {
  constructor(private readonly apiService: ApiService) { }
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }),
  )
  async transcriptFile(@UploadedFile() file: FileMem) {
    try {
      return (await this.apiService.transcript(file.buffer, file.originalname));
    } catch (error) {
      throw new InternalServerErrorException(
        error?.response?.data?.error?.message || error?.message)

    }
  }
}

interface FileMem {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
  size: number;
}