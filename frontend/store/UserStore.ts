import { createStore } from 'zustand/vanilla';

import { persist, devtools, createJSONStorage } from 'zustand/middleware';

import UserType from '../types/UserType';
import { GET_USER_ENDPOINT, LOGOUT_ENDPOINT } from '@/constants/api_endpoint';

export type UserState = {
  isAuthenticated: boolean;
  user: UserType;
  showLoginDialog: boolean;
};

export type UserActions = {
  setUser: (data: UserType) => void;
  logOut: () => void;
  signIn: (data: any) => void;
  signUp: (data: UserType) => void;
  setShowLoginDialog: (data: boolean) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  isAuthenticated: false,
  user: null,
  showLoginDialog: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          logOut: async () => {
            await fetch(LOGOUT_ENDPOINT, { method: 'POST', credentials: 'include' });
            set(initState);
          },
          setUser: (data) =>
            set((state) => ({
              ...state,
              isAuthenticated: true,
              user: data,
            })),
          signIn: async (data) => {
            const dataUser = await fetch(GET_USER_ENDPOINT, {
              headers: { Authorization: `Bearer ${data.accessToken}` },
            }).then((data) => data.json());
            // console.log(dataUser)
            set((state) => ({
              ...state,
              isAuthenticated: true,
              user: dataUser.data,
            }));
          },
          signUp: (data) => {
            set({ user: data });
          },
          setShowLoginDialog: (data) => {
            set({ showLoginDialog: data });
          },
        }),
        {
          name: 'UserStore',
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
};
