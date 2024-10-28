import { createStore } from 'zustand/vanilla';

import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import debounce from 'debounce';
import { postItemToCart } from '@/actions/cart';
import CartItemType from '@/types/CartItemType';
import { array, bigint } from 'zod';

export type CartState = {
  items: CartItemType[];
  isSync: boolean;
};

export type CartActions = {
  resetCart: () => void;
  addItem: (data: CartItemType) => void;
  deleteItem: (data: CartItemType) => void;
  subtractItem: (data: CartItemType) => void;
  syncItems: (data: CartItemType[]) => void;
  postItem: (isAuthenticated: boolean) => void;
  calcTotalPrice: () => void;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  items: [],
  isSync: false,
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
              const existingItem = state.items.find((item) => item.documentId === data.documentId);
              if (existingItem) {
                return {
                  ...state,
                  items: state.items.map((item) =>
                    item.documentId === data.documentId ? { ...item, quantity: item.quantity + data.quantity } : item
                  ),
                };
              } else {
                return {
                  ...state,
                  items: [...state.items, { ...data, quantity: data.quantity }],
                };
              }
            });
          },
          deleteItem: (data) => {
            set((state) => ({
              items: state.items.filter((item) => item.documentId != data.documentId),
              // totalPrice:
              //   state.totalPrice -
              //   BigInt(state.items.find((item) => item.documentId === data.documentId)!.quantity) * data.price!,
            }));
          },
          subtractItem: (data) => {
            set((state) => {
              const existingItem = state.items.find((item) => item.documentId === data.documentId);
              if (existingItem!.quantity - 1 <= 0)
                return {
                  ...state,
                  items: state.items.filter((item) => item.documentId !== data.documentId),
                };
              else
                return {
                  ...state,
                  items: state.items.map((item) =>
                    item.documentId === data.documentId ? { ...item, quantity: item.quantity - 1 } : item
                  ),
                };
            });
          },
          postItem: debounce(async (isAuthenticated: boolean) => {
            if (!isAuthenticated) return;
            const formData = new FormData();
            formData.append(
              'cart',
              new Blob([JSON.stringify({ cartItems: get().items })], { type: 'application/json' })
            );
            const data = await postItemToCart(formData);
            return data;
          }, 5000),
          syncItems: (data) => {
            set((state) => {
              if (!state.isSync) {
                let temp: { [key: string]: { price: bigint; quantity: number } } = {};
                data.forEach((element) => {
                  temp[element.documentId] = { price: element.price, quantity: element.quantity };
                });
                state.items.forEach((item) => {
                  temp[item.documentId] = {
                    price: item.price,
                    quantity: item.quantity + (temp[item.documentId]?.quantity ?? 0),
                  };
                });
                let arrayTemp: CartItemType[] = [];
                for (const prop in temp) {
                  arrayTemp.push({ documentId: prop, quantity: temp[prop].quantity, price: temp[prop].price });
                }
                return { isSync: true, items: arrayTemp };
              }

              return { ...state, items: [...data] };
            });
          },
          calcTotalPrice: () => {
            return get()
              .items.map((item) => {
                return BigInt(item.quantity) * BigInt(item.price);
              })
              .reduce((acc, curr) => acc + curr, BigInt(0));
          },
        }),
        {
          name: 'CartStore',
          storage: createJSONStorage(() => localStorage),
        }
      )
    )
  );
};
