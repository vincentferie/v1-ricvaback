import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcritureChargesEntity } from '../ecriture/charges/ecriture-charges.entity';
import { ChargeBlEntity } from './bl-charges/bl-charges.entity';
import { ChargesController } from './charges.controller';
import { ChargesEntity } from './charges.entity';
import { ChargesService } from './charges.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      ChargesEntity, 
      ChargeBlEntity,
      EcritureChargesEntity
    ])
  ],
  controllers: [ChargesController],
  providers: [ChargesService]
})
export class ChargesModule {}
