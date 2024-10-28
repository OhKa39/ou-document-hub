import DocumentType from './DocumentType';

type CartItemType = {
  documentId: string;
  quantity: number;
  itemId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  price: bigint;
};

export default CartItemType;
