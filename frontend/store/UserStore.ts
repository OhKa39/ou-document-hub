// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla'

import {persist, devtools } from 'zustand/middleware'

import UserSchema from '../schemas/UserSchema'

export type UserState = {
  isAuthenticated: boolean; 
  user: UserSchema;
}

export type UserActions = {
  setUser: (data: UserSchema) => void
  logOut: () => void
  signIn: (data: any) => void
  signUp: (data: UserSchema) => void
}

export type UserStore = UserState & UserActions

export const defaultInitState: UserState = {
  isAuthenticated: false, 
  user: null
}

export const createUserStore = (
  initState: UserState = defaultInitState,
) => {
  return createStore<UserStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          logOut: async () => {
            await fetch(`/api/v1/auth/logout`, { method: 'POST', credentials: "include" })
            set(initState)
          },
          setUser: (data) => set((state)=>({
            ...state,
            isAuthenticated: true,
            user: data
          })),
          signIn: async (data) => { 
            const dataUser =  await fetch(`/api/v1/user`, { headers:{Authorization: `Bearer ${data.accessToken}`}}).then((data)=>data.json());
            // console.log(dataUser)
            set((state) => ({ 
                ...state, 
                isAuthenticated: true,
                user: dataUser.data
            }))
          },
          signUp: (data) =>{ 
            set({user: data})
          }
        }),
        {
          name: 'UserStore',
        }
      )
    )
  )
}