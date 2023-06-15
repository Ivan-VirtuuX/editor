export interface IPage {
  pageId: string;
  name: string;
  author: string;
  markup: string;
  updatedAt: Date;
}

export interface IDocument {
  documentId: string;
  name: string;
  pages: IPage[];
  updatedAt: Date;
}
