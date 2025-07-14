import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './main/user/user.module';
import { AuthModule } from './main/auth/auth.module';
import { SubscriptionModule } from './main/subscription/subscription.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, AuthModule, SubscriptionModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
