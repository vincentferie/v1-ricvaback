import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VilleController } from './ville.controller';
import { VilleEntity } from './ville.entity';
import { VilleService } from './ville.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VilleEntity])
  ],
  controllers: [VilleController],
  providers: [VilleService],
  exports: [VilleService]
})
export class VilleModule {}
