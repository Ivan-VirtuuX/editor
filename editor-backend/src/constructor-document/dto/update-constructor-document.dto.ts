import { PartialType } from '@nestjs/mapped-types';
import { CreateConstructorDocumentDto } from './create-constructor-document.dto';

export class UpdateConstructorDocumentDto extends PartialType(CreateConstructorDocumentDto) {}
