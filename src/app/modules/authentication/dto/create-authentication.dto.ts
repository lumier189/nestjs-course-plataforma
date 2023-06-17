import { IsString, Length } from 'class-validator';

export class CreateAuthenticationDto {
  @IsString()
  email: string;

  @IsString()
  @Length(8, 16)
  password: string;
}
