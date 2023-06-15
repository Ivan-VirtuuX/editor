import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConstructorDocumentDocument = ConstructorDocument & Document;

export interface IPage {
  pageId: string;
  text: string;
  updatedAt: Date;
  markup: string;
}

@Schema()
export class ConstructorDocument {
  @Prop()
  documentId: string;

  @Prop()
  name: string;

  @Prop()
  updatedAt: Date;

  @Prop()
  pages: IPage[];
}

export const ConstructorDocumentSchema =
  SchemaFactory.createForClass(ConstructorDocument);
