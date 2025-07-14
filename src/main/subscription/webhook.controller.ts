import {
  Controller,
  Post,
  Req,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-06-30.basil',
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody, // Cast if needed
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return { received: false };
    }

    await this.subscriptionService.saveSubscriptionFromWebhook(event);

    return { received: true };
  }
}
