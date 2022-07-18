import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from './site.entity';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteEntity])
  ],
  controllers: [SitesController],
  providers: [SitesService,] // Ajouter l'autre repository appeler dans le service dans le provider 
})
export class SitesModule { }
