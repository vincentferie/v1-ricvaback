import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FluxTresorerieParamsController } from './flux-tresorerie-params.controller';
import { FluxTresorerieParamsEntity } from './flux-tresorerie-params.entity';
import { FluxTresorerieParamsService } from './flux-tresorerie-params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FluxTresorerieParamsEntity])
  ],
  controllers: [FluxTresorerieParamsController],
  providers: [FluxTresorerieParamsService],
  exports: [FluxTresorerieParamsService]
})
export class FluxTresorerieParamsModule {}
