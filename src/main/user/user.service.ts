import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'src/common/apiResponse/apiResponse';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    try{
      const allUsers = await this.prisma.user.findMany()
      console.log(allUsers)
    return ApiResponse.success(allUsers, "users fatched sucessfully")
    }catch(error){
      return ApiResponse.error(error , "Users fatched faid")
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
