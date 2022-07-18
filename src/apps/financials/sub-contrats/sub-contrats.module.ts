import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubContratsController } from './sub-contrats.controller';
import { SubContratsEntity } from './sub-contrats.entity';
import { SubContratsService } from './sub-contrats.service';
import { SubFileContratsEntity } from './sub-files-contrats/sub-file-contrat.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      SubContratsEntity,
      SubFileContratsEntity
    ])
  ],
    controllers: [SubContratsController],
    providers: [SubContratsService]
  })
  export class SubContratsModule {}
  