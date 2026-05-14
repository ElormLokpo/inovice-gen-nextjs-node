import { create } from 'zustand'
import { persist } from 'zustand/middleware';

export type UserRole = "admin" | "user" | "guest";

export interface IUserData{
    id:string;
    fullName:string;
    email:string;
    role:UserRole;
    emailVerified:boolean;
}

interface AuthState {
  userData: IUserData | null;
  token: string | null;
  hasHydrated: boolean;
  setUser: (userData: IUserData) => void;
  setToken: (token: string) => void;
  setAuth: (payload: { user: IUserData; token: string }) => void;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist((set)=>({
    userData:null,
    token:null,
    hasHydrated:false,
    setUser:(userData:IUserData)=>set({userData}), 
    setToken:(token:string)=>set({token}), 
    setAuth:({ user, token })=>set({userData:user, token}),
    clearAuth:()=>set({userData:null, token:null}), 
    setHasHydrated:(hasHydrated:boolean)=>set({hasHydrated}),
  }),
  {
    name:"authData",
    onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
  }
))

interface SideModalState{
    isOpen:boolean;
    openModal:()=>void;
    closeModal:()=>void;
    toggleModal:()=>void;
}

export const useSideModal = create<SideModalState>()((set)=>({
    isOpen:false,
    openModal:()=>set({isOpen:true}),
    closeModal:()=>set({isOpen:false}),
    toggleModal:()=>set((state)=>({isOpen:!state.isOpen}))
}))