import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum Plantype{
    DIGITAL= 'digital',
    PREMIUM= 'premium',
    DELUXE = 'deluxe'
}

export class CreateSubscriptionDto {

     @ApiProperty({ enum: Plantype, example: Plantype.DIGITAL })
    @IsEnum(Plantype)
    plan: Plantype

}


