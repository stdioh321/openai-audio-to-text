import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api/api.service';
import { AudioController } from './audio/audio.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilename(),
    }),
  ],
  controllers: [AppController, AudioController],
  providers: [AppService, ApiService],
})
export class AppModule { }


function getEnvFilename() {
  return `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ``}`;
}
