import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser";
// import * as csurf from 'csurf';
import * as helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle(AppModule.swagger.title)
    .setDescription(AppModule.swagger.description)
    .setVersion(AppModule.swagger.version)
    //.addTag(AppModule.swagger.tag)
    .addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}, 'Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(AppModule.swagger.url, app, document);

  // the next two lines did the trick
  app.use(bodyParser.json({limit: '50mb'})); 
  app.use(bodyParser.raw({limit: '50mb'}) );
  app.use(bodyParser.urlencoded({limit: '10mb', parameterLimit: 10000, extended: false}));
  // Env Apps setting
  app.enableCors();
  // somewhere in your initialization file
  //app.use(csurf());
  // somewhere in your initialization file
  app.use(helmet());
  
  await app.listen(AppModule.port);

 // Hot Reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
