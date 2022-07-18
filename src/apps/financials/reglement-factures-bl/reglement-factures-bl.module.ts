import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReglementFacturesBlController } from './reglement-factures-bl.controller';
import { ReglementsFactureBlEntity } from './reglement-factures-bl.entity';
import { ReglementFacturesBlService } from './reglement-factures-bl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReglementsFactureBlEntity])
  ],
  controllers: [ReglementFacturesBlController],
  providers: [ReglementFacturesBlService]
})
export class ReglementFacturesBlModule {}
