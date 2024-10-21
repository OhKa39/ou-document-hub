import UserType from './UserType';

type DocumentType = {
  documentId: string;
  name: string;
  price: BigInt;
  image: any;
  thumbnailUrl: string;
  status: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tag: string;
  stock?: number;
  user: UserType;
  documentType: string;
  description: string;
  facultyName: string;
};

export default DocumentType;
