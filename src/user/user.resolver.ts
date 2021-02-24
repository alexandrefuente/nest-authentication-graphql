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
    @UseGuards(GqlAuthGuard) // calling a Guard to protect this router
    @Query(() => [User])
    async users(): Promise<User[]> {
        return await this.userService.findAllUsers()
    }

    /**
     * Get an user by ID
     * @param id
     */
    @Query(() => User)
    async getUser(@Args('id') id: string): Promise<User> {
        return await this.userService.getUserById(id)
    }

    /**
     * Get an user by email
     * @param email 
     */
    @Query(() => User)
    async getUserByEmail(@Args('email') email: string): Promise<User> {
        return await this.userService.getUserByEmail(email)
    }

    /**
     * Create a new user
     * @param data 
     */
    @Mutation(() => User)
    async createUser(
        @Args('data') data: CreateUserInput
    ): Promise<User> {
        const user = await this.userService.createUser(data)
        return user
    }

    /**
     * Update an user
     * @param data 
     */
    @Mutation(() => User)
    async updateUser(
        @Args('id') id: string,
        @Args('data') data: UpdateUserInput
    ): Promise<User> {
        const user = this.userService.updateUser(id, data)
        return user
    }

    /**
     * Delete an user
     * @param id 
     */
    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: string): Promise<boolean> {
        return await this.userService.delete(id)
    }
}
