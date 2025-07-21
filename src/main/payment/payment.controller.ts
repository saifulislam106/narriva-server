import { Controller, Get, Post, Body, Query, Res, Req, Headers, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('cheakout')
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }


  @Get('check-payment')
  checkPayment(@Query('email') email: string) {
    return this.paymentService.checkPayment({ email });
  }

  


  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const rawBody = req.body as Buffer;
      const result = await this.paymentService.handleWebhook(rawBody, signature);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // console.error('Webhook Error:', error.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${error.message}`);
    }
  }
}
