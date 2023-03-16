import { IsString, Matches, MinLength } from 'class-validator';

const urlRegex = /^(http|https):\/\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/i;

export class AudioUrlForm {
  @IsString()
  @MinLength(3)
  @Matches(urlRegex, { message: 'Invalid URL' })
  url: string;
}
