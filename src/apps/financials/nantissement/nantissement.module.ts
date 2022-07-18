import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorisationSortieEntity } from './files-nantissement/autorisation-sortie/autorisation-sortie.entity';
import { LettreDetentionEntity } from './files-nantissement/lettre-detention/lettre-detention.entity';
import { LotsNantisEntity } from './lots-nantis/lots-nantis.entity';
import { LotsNantisRepository } from './lots-nantis/lots-nantis.repository';
import { NantissementController } from './nantissement.controller';
import { NantissementEntity } from './nantissement.entity';
import { NantissementService } from './nantissement.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      NantissementEntity,
      LotsNantisEntity,
      LotsNantisRepository,
      LettreDetentionEntity,
      AutorisationSortieEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [NantissementController],
  providers: [NantissementService]
})
export class NantissementModule {}
