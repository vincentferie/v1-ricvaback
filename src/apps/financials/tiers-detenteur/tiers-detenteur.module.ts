import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiersDetenteurController } from './tiers-detenteur.controller';
import { TierDetenteursEntity } from './tiers-detenteur.entity';
import { TiersDetenteurService } from './tiers-detenteur.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([TierDetenteursEntity])
  ],
  controllers: [TiersDetenteurController],
  providers: [TiersDetenteurService]
})
export class TiersDetenteurModule {}
