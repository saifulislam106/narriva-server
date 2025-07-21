import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
