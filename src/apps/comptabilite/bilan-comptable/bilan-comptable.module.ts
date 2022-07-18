import { Module } from '@nestjs/common';
import { BilanComptableController } from './bilan-comptable.controller';
import { BilanComptableService } from './bilan-comptable.service';

@Module({
  controllers: [BilanComptableController],
  providers: [BilanComptableService]
})
export class BilanComptableModule {}
