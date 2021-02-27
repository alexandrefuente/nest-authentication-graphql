import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '28800s'
        }
      })
    })
  ],
  providers: [AuthService, AuthResolver, JwtStrategy]
})
export class AuthModule {}
