import { InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType()
export class UpdateUserInput {
    @IsString()
    @IsNotEmpty({message: 'Invalid characters'})
    @IsOptional()
    name?: string

    @IsEmail()
    @IsNotEmpty({message: 'Invalid E-mail'})
    @IsOptional()
    email?: string

    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    @IsOptional()
    password?: string
}
