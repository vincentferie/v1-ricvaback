import { Module } from '@nestjs/common';
import { InfosExportateurController } from './infos-exportateur.controller';
import { InfosExportateurService } from './infos-exportateur.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfosExportateurEntity } from './infos-exportateur.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([InfosExportateurEntity])
  ],
  controllers: [InfosExportateurController],
  providers: [InfosExportateurService]
})
export class InfosExportateurModule { }
