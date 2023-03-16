import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

import * as FormData from 'form-data';

@Injectable()
export class ApiService {
  constructor(private configService: ConfigService) { }

  async transcript(buffer, filename: string): Promise<string> {
    const data = new FormData();
    data.append('file', buffer, { filename: filename });
    data.append('model', 'whisper-1');
    data.append('language', 'pt');

    const config = {
      method: 'post',
      url: `${this.configService.get(
        'OPENAI_BASE_URL',
      )}/v1/audio/transcriptions`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${this.configService.get('OPENAI_KEY')}`,
        ...data.getHeaders(),
      },
      data: data,
    };
    return (await axios(config)).data;
  }
}