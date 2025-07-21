import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreatePaymentDto {
   @ApiProperty({ example: 10 })
     @IsNumber()
     price: number
 
 
     @ApiProperty({ example: 'cus_1Nxxxxxx' })
     @IsString()
     @IsNotEmpty()
     userId: string

    
}
