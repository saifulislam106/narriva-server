import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports:[PrismaModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: "5d"}
  })],
  exports: [JwtModule]
})
export class AuthModule {}
