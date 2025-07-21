
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'src/common/apiResponse/apiResponse';
import { PlanType, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  }
  async createPayment(dto: CreatePaymentDto) {
    const { userId, price } = dto;

    const isSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (isSubscription) {
      throw new BadRequestException('You have already subscribed');
    }

    //  Get user with Stripe customer ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    let stripeCustomerId = user.stripeCustomerId;

    //  Create customer in Stripe if not exists
    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      stripeCustomerId = customer.id;

      // Save Stripe customer ID in your DB
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: stripeCustomerId, // Stripe customer ID
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Instant Payment',
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: process.env.CLIENT_URL_SUCCESSFUL,
      cancel_url: process.env.CLIENT_URL_CANCEL,
      payment_intent_data: {
        metadata: {
          userId,
        },
      },
    });

    if (!session?.url)
      throw new BadRequestException('Stripe session creation failed');

    return { url: session.url };
  }



  async checkPayment(data: { email: string }) {

    try {
      const { email } = data;


      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      console.log(user, "user")
      if (!user) {
        throw new NotFoundException('User not found');
      }


      const subscription = await this.prisma.subscription.findFirst({
        where: {
          userId: user.id,
          isActive: true,
          endDate: {
            gte: new Date(),
          },
        },
      });
      console.log(subscription, "isSubscribed")
      const isSubscribed = !!subscription;

      return ApiResponse.success(
        { isSubscribed, subscription },
        isSubscribed
          ? 'User has an active subscription'
          : 'User does not have an active subscription'
      );
    } catch (error) {
      return ApiResponse.error(error, 'Failed to check subscription');
    }
  }





  async handleWebhook(rawBody: Buffer, signature: string) {
    const endpointSecret = this.config.get('WEBHOOK_SECRET');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_email;

        const user = await this.prisma.user.findUnique({ where: { email: customerEmail ?? '' } });

        if (user && session.subscription) {
          const subscription = await this.stripe.subscriptions.retrieve(session.subscription as string);

          function mapPlanType(planName: string): PlanType {
            switch (planName) {
              case 'digital':
                return PlanType.DIGITAL;
              case 'premium':
                return PlanType.PREMIUM;
              case 'deluxe':
                return PlanType.DELUXE;
              default:
                throw new Error(`Unknown plan type: ${planName}`);
            }
          }

          await this.prisma.subscription.create({
            data: {
              userId: user.id,
              name: subscription.items.data[0].price.nickname || 'BASIC',
              price: (subscription.items.data[0].price.unit_amount! / 100).toString(),
              plan: mapPlanType(subscription.items.data[0].price.nickname as string),
              startDate: new Date(subscription.start_date * 1000),
              endDate: new Date((subscription as any).current_period_end * 1000),
              isActive: true,
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await this.prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user) {
          await this.prisma.subscription.updateMany({
            where: {
              userId: user.id,
              isActive: true,
            },
            data: {
              isActive: false,
            },
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

}
