import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargementEntity } from './chargement.entity';
import { ChargementsController } from './chargements.controller';
import { ChargementsService } from './chargements.service';
import { FileChargementEntity } from './fiche-chargement/file-chargement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChargementEntity,
      FileChargementEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [ChargementsController],
  providers: [ChargementsService]
})
export class ChargementsModule {}
