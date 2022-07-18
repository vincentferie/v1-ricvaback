import { Module } from '@nestjs/common';
import { EtatChargesController } from './etat-charges.controller';
import { EtatChargesService } from './etat-charges.service';

@Module({
  controllers: [EtatChargesController],
  providers: [EtatChargesService]
})
export class EtatChargesModule {}
