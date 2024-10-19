type DocumentType = {
  documentId: number;
  name: string;
  price: BigInt;
  image: any;
  thumbnailUrl: string | undefined;
  status: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export default DocumentType;
