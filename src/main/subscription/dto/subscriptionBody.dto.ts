import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionBodyDto {
  @ApiProperty({
    description: 'Stripe subscription ID',
    example: 'sub_1Nxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  stripeSubscriptionId: string;

  @ApiProperty({
    description: 'Stripe customer ID',
    example: 'cus_1Nxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  stripeCustomerId: string;

  @ApiProperty({
    description: 'Stripe checkout session ID',
    example: 'cs_test_1Nxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  stripeSessionId: string;
}
