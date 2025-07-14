import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common/apiResponse/apiResponse';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {

  constructor(private pisma: PrismaService, private jwtService: JwtService) { }

  async signUp(signUpDto: SignUpDto) {

    try {
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10)
      const data = {
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword
      }

      const user = await this.pisma.user.create({
        data,
      })
      return ApiResponse.success(user, "User created successfully");
    } catch (error) {
      return ApiResponse.error(error, "User does not created")
    }
  }

  async login(loginDto: LoginDto) {

    try {
      const user = await this.pisma.user.findFirst({
        where: {
          email: loginDto.email
        }
      })
      if (!user) {
        throw new UnauthorizedException("User account not Found")
      }

      const matchedPassword = await bcrypt.compare(
        loginDto.password,
        user.password
      )
      console.log("password", matchedPassword)

      if (!matchedPassword) {
        throw new UnauthorizedException("Password dose not matched")
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      }
      const token = await this.jwtService.signAsync(payload)
      console.log("token", token)
      return ApiResponse.success(token, "login Successfully")
    } catch (error) {
      return ApiResponse.error(error, "Login faild")
    }
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
