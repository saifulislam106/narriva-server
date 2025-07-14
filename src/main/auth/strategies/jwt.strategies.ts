import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_TOKEN, // should match the one used in login token
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}






//     if (!user) throw new NotFoundException('User not found');

//       await this.prisma.subscription.create({
//         data: {
//           userId: user.id,
//           stripeCustomerId: session.customer as string,
//           stripeSubscriptionId: session.subscription as string,
//           plan: session.metadata.plan as Plantype,
//         },
//       });
//     }
//   }

//   async getUserSubscription(userId: string) {
//     return this.prisma.subscription.findUnique({
//       where: { userId },
//     });
//   }

//   async cancelSubscription(userId: string) {
//     const subscription = await this.getUserSubscription(userId);
//     if (!subscription) throw new NotFoundException('Subscription not found');

//     await this.stripe.subscriptions.del(subscription.stripeSubscriptionId);
//     return this.prisma.subscription.delete({ where: { id: subscription.id } });
//   }
// }