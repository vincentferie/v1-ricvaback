import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SeederModule } from "./seeders/seed.module";
import { Seeder } from "./seeders/seeder";

async function bootstrap() {
    NestFactory.createApplicationContext(SeederModule)
      .then(appContext => {
        const logger = appContext.get(Logger);
        const seeder = appContext.get(Seeder);
        seeder
          .seed()
          .then(() => {
            logger.debug('Seeding complete!');
          })
          .catch(error => {
            logger.error('Seeding failed!');
            throw error;
          })
          .finally(() => appContext.close());
      })
      .catch(error => {
        throw error;
      });
  }
bootstrap();