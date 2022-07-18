import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteResultatPosteController } from './compte-resultat-poste.controller';
import { CompteResultatPosteEntity } from './compte-resultat-poste.entity';
import { CompteResultatPosteService } from './compte-resultat-poste.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompteResultatPosteEntity])
  ],
  controllers: [CompteResultatPosteController],
  providers: [CompteResultatPosteService],
  exports: [CompteResultatPosteService],
})
export class CompteResultatPosteModule {}
