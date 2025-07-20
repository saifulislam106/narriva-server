

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { addDays } from "date-fns";
import { PlanType } from "@prisma/client";
import { ApiResponse } from "src/common/apiResponse/apiResponse";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";



export enum Plantype {
  DIGITAL = 'DIGITAL',
  PREMIUM = 'PREMIUM',
  DELUXE = 'DELUXE',
}


@Injectable()
export class SubscriptionService {

  constructor(private prisma: PrismaService) {
    // this.stripe = new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY'));
  }

  async createSubscription(dto: CreateSubscriptionDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) throw new NotFoundException('User not found');

      const now = new Date();
      const endDate = addDays(now, 30); // 30 days

      const result = this.prisma.subscription.create({
        data: {
          name: dto.name,
          price: dto.price,
          userId: dto.userId,
          plan: dto.plan as PlanType,
          startDate: now,
          endDate,
        },
      });
      return ApiResponse.success(result, "Subscription created successfully");
    } catch (error) {
      return ApiResponse.error(error, "Subscription not created")
    }
  }


  async getAllSubscriptions() {
    try {
      const result = this.prisma.subscription.findMany();
      return ApiResponse.success(result, "Subscriptions fatched successfully");
    } catch (error) {
      return ApiResponse.error(error, "Subscriptions fatched faid")
    }
  }


  async getSingleUserActiveSubscription(userId: string) {
    try {
      const result = this.prisma.subscription.findFirst({
        where: {
          userId,
          isActive: true,
          endDate: {
            gte: new Date(),
          },
        },
      });
      return ApiResponse.success(result, "Subscription found successfully");
    } catch (error) {
      return ApiResponse.error(error, "Subscription not found")
    }
  }


  async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
    try {
      const result = this.prisma.subscription.update({
        where: { id },
        data: dto,
      });
      return ApiResponse.success(result, "Subscription updated successfully");
    } catch (error) {
      return ApiResponse.error(error, "Subscription not updated")
    }
  }


  async cancelSubscription(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) throw new NotFoundException('User not found');

      const result = this.prisma.subscription.update({
        where: { id },
        data: { isActive: false },
      });
      return ApiResponse.success(result, "Subscription cancelled successfully");
    } catch (error) {
      return ApiResponse.error(error, "Subscription canceled faid")
    }
  }
}



















// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { Stripe } from 'stripe';
// import { CreateSubscriptionDto, Plantype } from './dto/create-subscription.dto';
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateSubscriptionDto, PlanType } from './dto/create-subscription.dto';
// import { addDays } from 'date-fns';


// @Injectable()
// export class SubscriptionService {
//   private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//     // apiVersion: '2025-06-30.basil',
//   });

//   constructor(private prisma: PrismaService) {}

//   async createCheckoutSession(userId: string, dto: CreateSubscriptionDto) {
//     const user = await this.prisma.user.findFirst({ where: { id: userId } });
//     if (!user) throw new NotFoundException('User not found');

//     const priceId = this.getPriceId(dto.plan);

//     const customer = await this.stripe.customers.create({
//       email: user.email,
//     });

//     const session = await this.stripe.checkout.sessions.create({
//        payment_method_types: ['card'],
//       mode: 'subscription',
//       customer: customer.id,
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.FRONTEND_URL}/success`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     });

//     return { url: session.url };
//   }

//   private getPriceId(plan: Plantype) {
//     switch (plan) {
//       case Plantype.DIGITAL:
//         return process.env.STRIPE_PRICE_DIGITAL!;
//       case Plantype.PREMIUM:
//         return process.env.STRIPE_PRICE_PREMIUM!;
//       case Plantype.DELUXE:
//         return process.env.STRIPE_PRICE_DELUXE!;
//       default:
//         throw new Error('Invalid plan');
//     }
//   }

//   async saveSubscriptionFromWebhook(event: Stripe.Event) {
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const subscriptionId = session.subscription as string;
//       const customerId = session.customer as string;
//       const sessionId = session.id;

//       await this.createSubscription(subscriptionId, customerId, sessionId);
//     }
//   }

//   async createSubscription(
//     stripeSubscriptionId: string,
//     stripeCustomerId: string,
//     stripeSessionId: string,
//   ) {
//     const stripeSub = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
//     const customer = await this.stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;

//     const userEmail = customer.email;
//     if (!userEmail) throw new NotFoundException('Email not found from Stripe customer');

//     const user = await this.prisma.user.findUnique({
//       where: { email: userEmail },
//     });
//     if (!user) throw new NotFoundException('User not found');

//     const planName = stripeSub.items.data[0].price.nickname || 'unknown';
//     const plan = await this.prisma.subscriptionPlan.findFirst({
//       where: { name: { equals: planName, mode: 'insensitive' } },
//     });

//     if (!plan) throw new NotFoundException('Plan not found in DB');

//     return this.prisma.subscription.create({
//       data: {
//         userId: user.id,
//         subscriptionPlanId: plan.id,
//         startDate: new Date(stripeSub.start_date * 1000),
//         endDate: new Date((stripeSub as any).current_period_end * 1000),
//         stripeCustomerId: customer.id,
//         stripeSubscriptionId: stripeSub.id,
//         stripeCheckoutSessionId: stripeSessionId,
//         cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
//         status: 'PAID',
//       },
//     });
//   }

//   async getUserSubscription(userId: string) {
//     return this.prisma.subscription.findFirst({
//       where: { userId },
//       include: { subscriptionPlan: true },
//     });
//   }

//   async cancelSubscription(userId: string) {
//     const sub = await this.prisma.subscription.findFirst({
//       where: { userId },
//     });

//     if (!sub?.stripeSubscriptionId)
//       throw new NotFoundException('No subscription found');

//     const canceled = await this.stripe.subscriptions.update(
//       sub.stripeSubscriptionId,
//       { cancel_at_period_end: true },
//     );

//     return { message: 'Subscription will cancel at period end', canceled };
//   }
// }
