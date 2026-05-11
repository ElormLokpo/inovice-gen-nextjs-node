import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface IUserData{
    id:string;
    fullname:string;
    username:string;
    role:string;
}

export const useAuthStore = create(
  persist((set)=>({
    userData:null,
    token:null,
    setUser:(userData:IUserData)=>set({userData}), 
    setToken:(token:string)=>set({token}), 
    clearAuth:()=>set({userData:null, token:null}), 
  }),
  {
    name:"authData",
    onRehydrateStorage: () => (state) => {
        console.log("Hydration finished!");
      },
  }
))