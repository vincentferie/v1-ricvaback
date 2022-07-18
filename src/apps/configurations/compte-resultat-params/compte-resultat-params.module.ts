import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteResultatParamsController } from './compte-resultat-params.controller';
import { CompteResultatParamsEntity } from './compte-resultat-params.entity';
import { CompteResultatParamsService } from './compte-resultat-params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompteResultatParamsEntity]),
  ],
  controllers: [CompteResultatParamsController],
  providers: [CompteResultatParamsService],
  exports: [CompteResultatParamsService]
})
export class CompteResultatParamsModule {}
