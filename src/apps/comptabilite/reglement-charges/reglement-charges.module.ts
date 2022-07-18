import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcritureChargesEntity } from '../ecriture/charges/ecriture-charges.entity';
import { ReglementChargesController } from './reglement-charges.controller';
import { ReglementChargesEntity } from './reglement-charges.entity';
import { ReglementChargesService } from './reglement-charges.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReglementChargesEntity,
      EcritureChargesEntity
    ])
  ],
  controllers: [ReglementChargesController],
  providers: [ReglementChargesService]
})
export class ReglementChargesModule {}
