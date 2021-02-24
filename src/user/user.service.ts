import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './entity/user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find()
        return users
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async createUser(data: CreateUserInput): Promise<User> {
        const user = await this.userRepository.create(data)
        const userSave = await this.userRepository.save(user)
        if (!userSave) {
            throw new InternalServerErrorException('Problem to create an user')
        }
        return userSave
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<User> {
        const user = await this.getUserById(id)
        await this.userRepository.update(user, { ...data })
        const userUpdated = this.userRepository.create({ ...user, ...data })
        return userUpdated
    }

    async delete(id: string): Promise<boolean> {
        const user = await this.getUserById(id)
        const deleted = await this.userRepository.delete(user)
        if (deleted) {
            return true
        }
        return false
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ email: email })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }
}
