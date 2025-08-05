import { createStore } from 'zustand/vanilla';

import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import DocumentSchema from '@/schemas/DocumentSchema';
import { z } from 'zod';
import { FileData } from '@/types/FileData';
interface FileMetadata {
  name: string;
  size: number;
}

interface DocumentFormData {
  name: string;
  description: string;
  price: number;
  faculty: string;
  documentType: 'Online' | 'Paper';
  stock?: number;
  shippingAddresses?: string[];
  thumbnail?: string;
  galleryImages: string[];
  onlineFile?: File;
}

export type DocumentDraftState = {
  formData: DocumentFormData | null;
};

export type DocumentDraftActions = {
  setFormData: (data: DocumentFormData) => void;
  clearFormData: () => void;
};

export type DocumentDraftStore = DocumentDraftState & DocumentDraftActions;

export const defaultInitState: DocumentDraftState = {
  formData: null,
};
export const createDocumentDraftStore = (initstate: DocumentDraftState = defaultInitState) => {
  return createStore<DocumentDraftStore>()(
    persist(
      (set, get) => ({
        formData: null,
        setFormData: (data) => set({ formData: data }),
        clearFormData: () => set({ formData: null }),
      }),
      {
        name: 'document-draft-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
};
