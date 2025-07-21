


import { Body, Controller, Post, Get, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  @Get('active')
  getAllActive() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Get('active/:userId')
  getSingleActive(@Param('userId') userId: string) {
    return this.subscriptionService.getSingleUserActiveSubscription(userId);
  }

  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto:UpdateSubscriptionDto) {
    return this.subscriptionService.updateSubscription(id , dto);
  }
  @Patch('cancel/:id')
  cancel(@Param('id') id: string) {
    return this.subscriptionService.cancelSubscription(id);
  }
}






  // @Put(':id')
  // updateSubscription(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateSubscriptionDto,
  // ) {
  //   return this.subscriptionService.updateSubscription(id, dto);
  // }


















// import {
//   Controller,
//   Post,
//   Body,
//   UseGuards,
//   Req,
//   Get,
//   Delete,
//   Headers,
//   RawBodyRequest,
//   Request,
// } from '@nestjs/common';
// import { SubscriptionService } from './subscription.service';
// import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import Stripe from 'stripe';
// import { JwtAuthGuard } from '../auth/jwt.guard';
// import { CreateSubscriptionBodyDto } from './dto/subscriptionBody.dto';

// @ApiTags('Subscription')
// @ApiBearerAuth()
// @Controller('subscriptions')
// export class SubscriptionController {
//   private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: '2025-06-30.basil',
//   });

//   constructor(private readonly subscriptionService: SubscriptionService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post('checkout')
//   @ApiOperation({ summary: 'Create Stripe checkout session' })
//   @ApiResponse({
//     status: 201,
//     description: 'Checkout session created successfully',
//   })
//   async createCheckout(
//     @Body() dto: CreateSubscriptionDto,
//     @Request() req: any,
//   ) {
//     // req.user should contain user info after JWT guard validation
//     return this.subscriptionService.createCheckoutSession(req.user.id, dto);
//   }

//   // Stripe webhook endpoint (no auth guard because Stripe sends the requests)
//   @Post('webhook')
//   async handleWebhook(
//     @Req() req: RawBodyRequest<Request>,
//     @Headers('stripe-signature') sig: string,
//   ) {
//     let event: Stripe.Event;

//     try {
//       event = this.stripe.webhooks.constructEvent(
//         (req as any).rawBody,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!,
//       );
//     } catch (err) {
//       console.error('Webhook signature verification failed.', (err as Error).message);
//       return { received: false };
//     }

//     await this.subscriptionService.saveSubscriptionFromWebhook(event);

//     return { received: true };
//   }

//    @UseGuards(JwtAuthGuard)
//   @Post('create')
//   @ApiOperation({ summary: 'Create subscription record from Stripe data' })
//   @ApiResponse({
//     status: 201,
//     description: 'Subscription created successfully',
//   })
//   async createSubscription(
//     @Body() body: CreateSubscriptionBodyDto,
//     @Request() req: any,
//   ) {
//     const { stripeSubscriptionId, stripeCustomerId, stripeSessionId } = body;

//     // Optionally verify req.user matches customer or other auth logic here

//     return this.subscriptionService.createSubscription(
//       stripeSubscriptionId,
//       stripeCustomerId,
//       stripeSessionId,
//     );
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getMySubscription(@Req() req: any) {
//     return this.subscriptionService.getUserSubscription(req.user.id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete('cancel')
//   async cancel(@Req() req: any) {
//     return this.subscriptionService.cancelSubscription(req.user.id);
//   }
// }
