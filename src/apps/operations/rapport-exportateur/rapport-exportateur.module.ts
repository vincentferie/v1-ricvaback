import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampagneOutturnEntity } from 'src/apps/configurations/campagne/outturn/outturn.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { AnalysesEntity } from '../analyse/analyse.entity';
import { RapportExportateurController } from './rapport-exportateur.controller';
import { RapportExportateurService } from './rapport-exportateur.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      EntrepotEntity,
      CampagneOutturnEntity,
      AnalysesEntity
    ])
  ],
  controllers: [RapportExportateurController],
  providers: [RapportExportateurService]
})
export class RapportExportateurModule {}
