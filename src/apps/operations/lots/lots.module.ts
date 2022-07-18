import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { ChargementEntity } from '../chargements/chargement.entity';
import { FileTicketEntity } from './file-ticket/file-ticket-pesee.entity';
import { LotEntity } from './lot.entity';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LotEntity,
      FileTicketEntity,
      ChargementEntity,
      EntrepotEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [LotsController],
  providers: [LotsService]
})
export class LotsModule {}
