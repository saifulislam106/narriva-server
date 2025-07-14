
// src/main/auth/dto/signup.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {

  @ApiProperty({
    example: "Exumple",
    description: "This is name feild"
  })
  @IsString()
  name: string;

    @ApiProperty({
    example: "exumple@gmail.com",
    description: "This is email feild"
  })
  @IsEmail()
  email: string;

    @ApiProperty({
    example: "12345678",
    description: "This is password feild"
  })
  @IsString()
  @MinLength(6)
  password: string;
}
