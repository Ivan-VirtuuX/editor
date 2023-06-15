import { Module } from '@nestjs/common';
import { ConstructorDocumentService } from './constructor-document.service';
import { ConstructorDocumentController } from './constructor-document.controller';
import { ConstructorDocumentRepository } from './constructor-document.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConstructorDocument,
  ConstructorDocumentSchema,
} from './schemas/constructor-document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConstructorDocument.name, schema: ConstructorDocumentSchema },
    ]),
  ],
  controllers: [ConstructorDocumentController],
  providers: [ConstructorDocumentService, ConstructorDocumentRepository],
})
export class ConstructorDocumentModule {}
