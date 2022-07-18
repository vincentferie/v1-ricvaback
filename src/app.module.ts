import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import * as global from 'config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerHandlebars } from './config/mailer-handlebars.config';
import { moduleApps } from './helpers/import/import-module';
import { RolesGuard } from './helpers/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MailerModule.forRootAsync(mailerHandlebars),
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot({
      ttl: 120,
      limit: 50,
    }),
    ...moduleApps,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }    
  ],
})
export class AppModule {
 static port: number;
 static swagger: any;

  constructor(){ 
    const globalConfig = global.get('serve'); 
    const globalSwagger = global.get('swagger'); 

    AppModule.port = process.env.RDS_PORT || globalConfig.port;
    AppModule.swagger = globalSwagger;
  }
 }
