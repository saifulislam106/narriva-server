import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stripe } from 'stripe';
import { CreateSubscriptionDto, Plantype } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
  });

  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(userId: string, dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const priceId = this.getPriceId(dto.plan);

    const customer = await this.stripe.customers.create({
      email: user.email,
    });

    const session = await this.stripe.checkout.sessions.create({
       payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return { url: session.url };
  }

  private getPriceId(plan: Plantype) {
    switch (plan) {
      case Plantype.DIGITAL:
        return process.env.STRIPE_PRICE_DIGITAL!;
      case Plantype.PREMIUM:
        return process.env.STRIPE_PRICE_PREMIUM!;
      case Plantype.DELUXE:
        return process.env.STRIPE_PRICE_DELUXE!;
      default:
        throw new Error('Invalid plan');
    }
  }

  async saveSubscriptionFromWebhook(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      const sessionId = session.id;

      await this.createSubscription(subscriptionId, customerId, sessionId);
    }
  }

  async createSubscription(
    stripeSubscriptionId: string,
    stripeCustomerId: string,
    stripeSessionId: string,
  ) {
    const stripeSub = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const customer = await this.stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;

    const userEmail = customer.email;
    if (!userEmail) throw new NotFoundException('Email not found from Stripe customer');

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!user) throw new NotFoundException('User not found');

    const planName = stripeSub.items.data[0].price.nickname || 'unknown';
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: { equals: planName, mode: 'insensitive' } },
    });

    if (!plan) throw new NotFoundException('Plan not found in DB');

    return this.prisma.subscription.create({
      data: {
        userId: user.id,
        subscriptionPlanId: plan.id,
        startDate: new Date(stripeSub.start_date * 1000),
        endDate: new Date((stripeSub as any).current_period_end * 1000),
        stripeCustomerId: customer.id,
        stripeSubscriptionId: stripeSub.id,
        stripeCheckoutSessionId: stripeSessionId,
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        status: 'PAID',
      },
    });
  }

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId },
      include: { subscriptionPlan: true },
    });
  }

  async cancelSubscription(userId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId },
    });

    if (!sub?.stripeSubscriptionId)
      throw new NotFoundException('No subscription found');

    const canceled = await this.stripe.subscriptions.update(
      sub.stripeSubscriptionId,
      { cancel_at_period_end: true },
    );

    return { message: 'Subscription will cancel at period end', canceled };
  }
}
