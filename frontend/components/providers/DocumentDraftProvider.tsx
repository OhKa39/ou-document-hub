'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type DocumentDraftStore, createDocumentDraftStore } from '@/store/DocumentDraftStore';

export type DocumentDraftStoreApi = ReturnType<typeof createDocumentDraftStore>;

export const DocumentDraftStoreContext = createContext<DocumentDraftStoreApi | undefined>(undefined);

export interface DocumentDraftStoreProviderProps {
  children: ReactNode;
}

export const DocumentDraftStoreProvider = ({ children }: DocumentDraftStoreProviderProps) => {
  const storeRef = useRef<DocumentDraftStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createDocumentDraftStore();
  }

  return <DocumentDraftStoreContext.Provider value={storeRef.current}>{children}</DocumentDraftStoreContext.Provider>;
};

export const useDocumentDraftStore = <T,>(selector: (store: DocumentDraftStore) => T): T => {
  const documentDraftStoreContext = useContext(DocumentDraftStoreContext);

  if (!documentDraftStoreContext) {
    throw new Error(`useDocumentDraftStore must be used within DocumentDraftStoreProvider`);
  }

  return useStore(documentDraftStoreContext, selector);
};
