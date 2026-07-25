import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';


export class CreateTenantDto {

  @IsString()
  name: string;


  @IsEmail()
  adminEmail: string;


  @IsString()
  @MinLength(8)
  adminPassword: string;

}