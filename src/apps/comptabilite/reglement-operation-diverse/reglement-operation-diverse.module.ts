import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcritureChargesDiversesEntity } from '../ecriture/divers/ecriture-charges-ops.entity';
import { ReglementOperationDiverseController } from './reglement-operation-diverse.controller';
import { ReglementOperationDiverseEntity } from './reglement-operation-diverse.entity';
import { ReglementOperationDiverseService } from './reglement-operation-diverse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReglementOperationDiverseEntity,
      EcritureChargesDiversesEntity
    ])
  ],
  controllers: [ReglementOperationDiverseController],
  providers: [ReglementOperationDiverseService]
})
export class ReglementOperationDiverseModule {}
