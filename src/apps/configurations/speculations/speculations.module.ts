import { Module } from '@nestjs/common';
import { SpeculationsController } from './speculations.controller';
import { SpeculationsService } from './speculations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeculationEntity } from './speculation.entity';
import { DetailsSpeculationRepository } from '../details-speculation/detail-speculation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpeculationEntity])
  ],
  controllers: [SpeculationsController],
  providers: [SpeculationsService, DetailsSpeculationRepository],// Ajouter l'autre repository appeler dans le service dans le provider 
  exports: [SpeculationsService] 
})
export class SpeculationsModule { }
