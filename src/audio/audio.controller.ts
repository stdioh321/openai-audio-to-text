import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiService } from '../api/api.service';
import { memoryStorage } from 'multer';

import { exec } from 'child_process';
import { promisify } from 'util';
import { AudioUrlForm } from './autioUrl.form';

const execPromise = promisify(exec);

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
  @Get('url')
  async fileFromUrl(@Query() query: AudioUrlForm) {
    try {
      const result = await this.apiService.downloadFile(query.url);
      return this.apiService.transcript(result, 'smzinhoobichoebommesmo.mp3');
    } catch (error) {
      console.log(error);
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

class QueryDto { }