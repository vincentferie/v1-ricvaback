import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConst } from 'src/helpers/constant/jwt.define';
import { JwtStrategy } from 'src/helpers/jwt/jwt.strategy';
import { AccountRepository } from '../configurations/account/account.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConst.secret,
      signOptions: { expiresIn: 5000, algorithm: 'HS256' },
      verifyOptions: { clockTolerance: 3000000, algorithms: ['HS256'], maxAge: '600000ms' }
    }),
    TypeOrmModule.forFeature([
      AccountRepository
    ]),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy, PassportModule]

})
export class AuthModule { }
