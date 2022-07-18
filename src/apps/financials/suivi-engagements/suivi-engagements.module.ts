import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampagneSpecEntity } from 'src/apps/configurations/campagne-spec/campagne-spec.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { BanquesEntity } from '../banques/banques.entity';
import { SuiviEngagementsController } from './suivi-engagements.controller';
import { SuiviEngagementsService } from './suivi-engagements.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampagneSpecEntity,
      EntrepotEntity,
      BanquesEntity
    ])
  ],
  controllers: [SuiviEngagementsController],
  providers: [SuiviEngagementsService]
})
export class SuiviEngagementsModule {}
