import { createStore } from 'zustand/vanilla';

import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import debounce from 'debounce';

export type CartState = {
  items: CartItemType[];
};

export type CartActions = {
  resetCart: () => void;
  addItem: (data: CartItemType) => void;
  deleteItem: (data: CartItemType) => void;
  subtractItem: (data: CartItemType) => void;
  postItem: () => void;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  items: [],
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,
          resetCart: () => set(initState),
          addItem: (data) => {
            set((state) => {
              const existingItem = state.items.find((item) => item.itemId === data.itemId);
              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.itemId === data.itemId ? { ...item, quantity: item.quantity + data.quantity } : item
                  ),
                };
              } else {
                return {
                  items: [...state.items, { ...data, quantity: 1 }],
                };
              }
            });
          },
          deleteItem: (data) => {
            set((state) => ({ items: state.items.filter((item) => item.itemId != data.itemId) }));
          },
          subtractItem: (data) => {
            set((state) => {
              const existingItem = state.items.find((item) => item.itemId === data.itemId);
              if (existingItem!.quantity - 1 < 0)
                return {
                  items: state.items.filter((item) => item.itemId !== data.itemId),
                };
              else
                return {
                  items: state.items.map((item) =>
                    item.itemId === data.itemId ? { ...item, quantity: item.quantity - 1 } : item
                  ),
                };
            });
          },
          postItem: debounce(() => {
            console.log(get().items);
          }, 3000),
        }),
        {
          name: 'CartStore',
          storage: createJSONStorage(() => localStorage),
        }
      )
    )
  );
};
