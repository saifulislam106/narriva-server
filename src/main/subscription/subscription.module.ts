import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [SubscriptionController, WebhookController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
