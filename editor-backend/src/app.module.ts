import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { mongo_data } from '../mongo-data';
import { ConstructorDocumentModule } from './constructor-document/constructor-document.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${mongo_data.MONGO_USERNAME}:${mongo_data.MONGO_PASSWORD}@${mongo_data.MONGO_DBNAME}`,
    ),
    ConfigModule.forRoot({}),
    ConstructorDocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
