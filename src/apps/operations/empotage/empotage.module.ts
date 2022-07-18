import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpotagesController } from './empotage.controller';
import { EmpotagesEntity } from './empotage.entity';
import { EmpotagesService } from './empotage.service';
import { LotEmpoteRepository } from './lot-empote/lot-empote.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpotagesEntity])
  ],
  controllers: [EmpotagesController],
  providers: [EmpotagesService, LotEmpoteRepository]
})
export class EmpotagesModule {}
