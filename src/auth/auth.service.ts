import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity'
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(data: AuthInput): Promise<AuthType> {
        const user = await this.userService.getUserByEmail(data.email)
        const validPassword = compareSync(data.password, user.password)
        if (!validPassword) {
            throw new UnauthorizedException('Unauthorized user')
        }
        const token = await this.createJwtToken(user)
        return {
            user,
            token
        }
    }

    private async createJwtToken(user: User): Promise<string> {
        const payload = { username: user.name, sub: user.id }
        return this.jwtService.signAsync(payload)
    }
}
