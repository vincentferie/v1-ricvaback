import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceController } from './balance.controller';
import { BalanceEntity } from './balance.entity';
import { BalanceService } from './balance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceEntity])
  ],
  controllers: [BalanceController],
  providers: [BalanceService]
})
export class BalanceModule {}
