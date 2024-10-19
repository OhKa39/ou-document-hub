import { IconType } from 'react-icons';

export type DOCUMENT_STATUS_ITEM_TYPE = {
  name: string;
  icon: IconType;
};

export type DOCUMENT_STATUS_TYPE = {
  [key: string]: DOCUMENT_STATUS_ITEM_TYPE;
};
