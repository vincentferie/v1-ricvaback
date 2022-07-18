import { Module } from '@nestjs/common';
import { CompteResultatController } from './compte-resultat.controller';
import { CompteResultatService } from './compte-resultat.service';

@Module({
  controllers: [CompteResultatController],
  providers: [CompteResultatService]
})
export class CompteResultatModule {}
