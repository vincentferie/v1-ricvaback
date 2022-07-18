import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactureBlController } from './facture-bl.controller';
import { FactureBlEntity } from './facture-bl.entity';
import { FactureBlService } from './facture-bl.service';
import { FileFactureBlEntity } from './files-factures-bl/file-factures.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      FactureBlEntity,
      FileFactureBlEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [FactureBlController],
  providers: [FactureBlService]
})
export class FactureBlModule {}
