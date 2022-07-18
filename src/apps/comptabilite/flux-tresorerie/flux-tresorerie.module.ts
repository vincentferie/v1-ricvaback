import { Module } from '@nestjs/common';
import { FluxTresorerieController } from './flux-tresorerie.controller';
import { FluxTresorerieService } from './flux-tresorerie.service';

@Module({
  controllers: [FluxTresorerieController],
  providers: [FluxTresorerieService]
})
export class FluxTresorerieModule {}
