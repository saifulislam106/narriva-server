
import {IsEmail, IsString, } from "class-validator"
import { LoginDto } from "./login.dto"

export class SignUpDto extends LoginDto{
    @IsString()
    name: string
}