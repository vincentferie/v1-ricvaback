import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as global from 'config';

const params = global.get('dbParams');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: params.type,
    host: process.env.RDS_HOSTNAME || params.host,
    port: +process.env.RDS_PORT || params.port,
    username: process.env.RDS_USERNAME || params.username,
    password: process.env.RDS_PASSWORD || params.password,
    database: process.env.RDS_DB_NAME || params.database,
    synchronize: process.env.TYPEORM_SYNC || params.synchronize,
    dropSchema: false ?? params.dropSchema,
    entities: [__dirname + '/../apps/**/*.entity{.js,.ts}'],
    // migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    // migrationsTableName: "migrations_typeorm",
    // migrationsRun: true,
    // cli: {
    //     migrationsDir: 'src/database/migrations'
    // },
    keepConnectionAlive: params.keepConnectionAlive,
    autoLoadEntities: params.autoLoadEntities,
    cache: params.cache || false 
};