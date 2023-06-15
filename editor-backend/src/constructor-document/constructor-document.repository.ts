import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import {
  ConstructorDocument,
  ConstructorDocumentDocument,
} from './schemas/constructor-document.schema';
import { CreateConstructorDocumentDto } from './dto/create-constructor-document.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class ConstructorDocumentRepository {
  constructor(
    @InjectModel(ConstructorDocument.name)
    private constructorDocumentRepository: Model<ConstructorDocumentDocument>,
  ) {}

  async getDocument(id: number) {
    return this.constructorDocumentRepository.find({ id });
  }

  async createDocument(
    createConstructorDocumentDto: CreateConstructorDocumentDto,
  ) {
    return this.constructorDocumentRepository.create({
      documentId: uuidv4(),
      name: createConstructorDocumentDto.name,
      updatedAt: new Date(),
    });
  }

  async createPage(createPageDto: CreatePageDto, documentId: string) {
    const page = {
      pageId: uuidv4(),
      name: createPageDto.name,
      author: createPageDto.author,
      updatedAt: new Date(),
      markup: createPageDto.markup,
    };

    await this.constructorDocumentRepository.findOneAndUpdate(
      { documentId },
      {
        $push: {
          pages: page,
        },
      },
    );
    return page;
  }

  async findAllPages(documentId: string) {
    const data = await this.constructorDocumentRepository.find({
      documentId,
    });
    return await data.map(({ pages }) => pages).flat();
  }

  async findCurrentPage(documentId: string, pageId: string) {
    const document = await this.constructorDocumentRepository.find({
      documentId,
    });

    return await document[0].pages.find((page) => page.pageId === pageId);
  }

  async getAllDocuments() {
    return this.constructorDocumentRepository.find();
  }

  async updatePage(
    documentId: string,
    pageId: string,
    updatePageDto: UpdatePageDto,
  ) {
    return this.constructorDocumentRepository.findOneAndUpdate(
      {
        documentId,
        'pages.pageId': pageId,
      },
      {
        $set: {
          'pages.$.name': updatePageDto.name,
          'pages.$.markup': updatePageDto.markup._value,
        },
      },
    );
  }

  async deletePage(documentId: string, pageId: string) {
    return this.constructorDocumentRepository.findOneAndUpdate(
      {
        documentId,
        'pages.pageId': pageId,
      },
      {
        $pull: {
          pages: {
            pageId,
          },
        },
      },
    );
  }
}
