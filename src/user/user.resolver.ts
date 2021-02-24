import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
    constructor(
        private userService: UserService
    ) {}
    @UseGuards(GqlAuthGuard)
    @Query(() => [User])
    async users(): Promise<User[]> {
        return await this.userService.findAllUsers()
    }

    @Query(() => User)
    async getUser(@Args('id') id: string): Promise<User> {
        return await this.userService.getUserById(id)
    }

    @Query(() => User)
    async getUserByEmail(@Args('email') email: string): Promise<User> {
        return await this.userService.getUserByEmail(email)
    }

    @Mutation(() => User)
    async createUser(
        @Args('data') data: CreateUserInput
    ): Promise<User> {
        const user = await this.userService.createUser(data)
        return user
    }

    @Mutation(() => User)
    async updateUser(
        @Args('id') id: string,
        @Args('data') data: UpdateUserInput
    ): Promise<User> {
        const user = this.userService.updateUser(id, data)
        return user
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: string): Promise<boolean> {
        return await this.userService.delete(id)
    }
}
