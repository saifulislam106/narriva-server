import { ApiProperty } from "@nestjs/swagger";
import { PlanType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

// export enum Plantype {
//     DIGITAL = 'DIGITAL',
//     PREMIUM = 'PREMIUM',
//     DELUXE = 'DELUXE'
// }

export class CreateSubscriptionDto {

    @ApiProperty({ example: 'digital subscription' })
    @IsString()
    name: string

    @ApiProperty({ example: 10 })
    @IsString()
    price: string

    @ApiProperty({ enum: PlanType, example: PlanType.DIGITAL })
    @IsEnum(PlanType)
    plan: PlanType

    @ApiProperty({ example: 'cus_1Nxxxxxx' })
    @IsString()
    @IsNotEmpty()
    userId: string

}


