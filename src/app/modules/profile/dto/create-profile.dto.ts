import { IsEmail, IsString, Length, Validate } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Length(8, 16)
  password: string;

  @IsString()
  passwordConfirmation: string;
}
