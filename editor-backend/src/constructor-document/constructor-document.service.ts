import { Injectable } from '@nestjs/common';
import { CreateConstructorDocumentDto } from './dto/create-constructor-document.dto';
import { ConstructorDocumentRepository } from './constructor-document.repository';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class ConstructorDocumentService {
  constructor(
    private readonly constructorDocumentRepository: ConstructorDocumentRepository,
  ) {}

  create(createConstructorDocumentDto: CreateConstructorDocumentDto) {
    return this.constructorDocumentRepository.createDocument(
      createConstructorDocumentDto,
    );
  }

  createPage(createPageDto: CreatePageDto, documentId: string) {
    return this.constructorDocumentRepository.createPage(
      createPageDto,
      documentId,
    );
  }

  findAllPages(documentId: string) {
    return this.constructorDocumentRepository.findAllPages(documentId);
  }

  findCurrentPage(documentId: string, pageId: string) {
    return this.constructorDocumentRepository.findCurrentPage(
      documentId,
      pageId,
    );
  }

  findAll() {
    return this.constructorDocumentRepository.getAllDocuments();
  }

  findOne(id: number) {
    return `This action returns a #${id} constructorDocument`;
  }

  updatePage(documentId: string, pageId: string, updatePageDto: UpdatePageDto) {
    return this.constructorDocumentRepository.updatePage(
      documentId,
      pageId,
      updatePageDto,
    );
  }

  deletePage(documentId: string, pageId: string) {
    return this.constructorDocumentRepository.deletePage(documentId, pageId);
  }
}
