import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ConstructorDocumentService } from './constructor-document.service';
import { CreateConstructorDocumentDto } from './dto/create-constructor-document.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('constructor-document')
export class ConstructorDocumentController {
  constructor(
    private readonly constructorDocumentService: ConstructorDocumentService,
  ) {}

  @Post()
  create(@Body() createConstructorDocumentDto: CreateConstructorDocumentDto) {
    return this.constructorDocumentService.create(createConstructorDocumentDto);
  }

  @Post(':id/page')
  createPage(
    @Param('id') documentId: string,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.constructorDocumentService.createPage(
      createPageDto,
      documentId,
    );
  }

  @Get(':id/page')
  findAllPages(@Param('id') documentId: string) {
    return this.constructorDocumentService.findAllPages(documentId);
  }

  @Get(':id/page/:pageId')
  findCurrentPage(
    @Param('id') documentId: string,
    @Param('pageId') pageId: string,
  ) {
    return this.constructorDocumentService.findCurrentPage(documentId, pageId);
  }

  @Get()
  findAll() {
    return this.constructorDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.constructorDocumentService.findOne(+id);
  }

  @Patch(':id/page/:pageId')
  updatePage(
    @Param('id') documentId: string,
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.constructorDocumentService.updatePage(
      documentId,
      pageId,
      updatePageDto,
    );
  }

  @Delete(':id/page/:pageId')
  deletePage(@Param('id') documentId: string, @Param('pageId') pageId: string) {
    return this.constructorDocumentService.deletePage(documentId, pageId);
  }
}
