import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
