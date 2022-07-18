import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotEntity } from 'src/apps/operations/lots/lot.entity';
import { LotsNantisRepository } from '../nantissement/lots-nantis/lots-nantis.repository';
import { NantissementRepository } from '../nantissement/nantissement.repository';
import { DenantissementController } from './denantissement.controller';
import { DenantissementEntity } from './denantissement.entity';
import { DenantissementService } from './denantissement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DenantissementEntity, LotEntity])
  ],
  controllers: [DenantissementController],
  providers: [DenantissementService, NantissementRepository, LotsNantisRepository]
})
export class DenantissementModule {}
