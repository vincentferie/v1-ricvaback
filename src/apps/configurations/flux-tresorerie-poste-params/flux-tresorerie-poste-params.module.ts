import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FluxTresoreriePosteParamsController } from './flux-tresorerie-poste-params.controller';
import { FluxTresoreriePosteParamsEntity } from './flux-tresorerie-poste-params.entity';
import { FluxTresoreriePosteParamsService } from './flux-tresorerie-poste-params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FluxTresoreriePosteParamsEntity])
  ],
  controllers: [FluxTresoreriePosteParamsController],
  providers: [FluxTresoreriePosteParamsService],
  exports: [FluxTresoreriePosteParamsService],
})
export class FluxTresoreriePosteParamsModule {}
