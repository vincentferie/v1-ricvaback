import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefreshTokenEntity,
    ])
  ],
  controllers: [],
  providers: []
})
export class RefreshTokenModule {}
