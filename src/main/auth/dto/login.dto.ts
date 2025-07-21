import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator"

export class LoginDto{
     @ApiProperty({
       example: "saifulislam106915@gmail.com",
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