import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonLivraisonController } from './bon-livraison.controller';
import { BonLivraisonEntity } from './bon-livraison.entity';
import { BonLivraisonService } from './bon-livraison.service';
import { DetailBlEntity } from './details-bl/detail-bl.entity';
import { FileBlEntity } from './files-bl/file-bl.entity';
import { MulterModule } from '@nestjs/platform-express';
import { DetailsBonLivraisonRepository } from './details-bl/detail-bl.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BonLivraisonEntity,
      DetailBlEntity,
      FileBlEntity,
      DetailsBonLivraisonRepository
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [BonLivraisonController],
  providers: [BonLivraisonService]
})
export class BonLivraisonModule {}
