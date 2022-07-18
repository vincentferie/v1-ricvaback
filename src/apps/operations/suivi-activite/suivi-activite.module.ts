import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampagneOutturnEntity } from 'src/apps/configurations/campagne/outturn/outturn.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { SiteEntity } from 'src/apps/configurations/sites/site.entity';
import { SuiviActiviteController } from './suivi-activite.controller';
import { SuiviActiviteService } from './suivi-activite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntrepotEntity,
      SiteEntity,
      CampagneOutturnEntity
    ])
  ],
  controllers: [SuiviActiviteController],
  providers: [SuiviActiviteService]
})
export class SuiviActiviteModule {}
