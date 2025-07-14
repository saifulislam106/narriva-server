import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('checkout')
  async createCheckout(@Req() req, @Body() dto: CreateSubscriptionDto) {
    const userId = req.user.id;
    console.log(`Creating checkout session for user ID: ${userId}`);
    return this.subscriptionService.createCheckoutSession(userId, dto);
  }

  @Get('me')
  async getMySubscription(@Req() req) {
    return this.subscriptionService.getUserSubscription(req.user.id);
  }

  @Delete('cancel')
  async cancel(@Req() req) {
    return this.subscriptionService.cancelSubscription(req.user.id);
  }
}
