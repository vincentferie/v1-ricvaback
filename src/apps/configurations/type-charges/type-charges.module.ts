import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeChargesController } from './type-charges.controller';
import { TypeChargesEntity } from './type-charges.entity';
import { TypeChargesService } from './type-charges.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeChargesEntity])
  ],
  controllers: [TypeChargesController],
  providers: [TypeChargesService]
})
export class TypeChargesModule {}
