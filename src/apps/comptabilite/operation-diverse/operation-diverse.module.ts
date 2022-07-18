import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcritureChargesDiversesEntity } from '../ecriture/divers/ecriture-charges-ops.entity';
import { OperationDiverseController } from './operation-diverse.controller';
import { OperationDiverseEntity } from './operation-diverse.entity';
import { OperationDiverseService } from './operation-diverse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OperationDiverseEntity,
      EcritureChargesDiversesEntity
    ])
  ],
  controllers: [OperationDiverseController],
  providers: [OperationDiverseService]
})
export class OperationDiverseModule {}
