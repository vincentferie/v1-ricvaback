import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';
import { AccountRepository } from './account.repository';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountRepository],
  exports: [AccountsService]
})
export class AccountsModule { }
