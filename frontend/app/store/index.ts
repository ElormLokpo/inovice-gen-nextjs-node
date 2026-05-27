import { ReactElement } from 'react';
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
    modalContent:ReactElement | null;
    isSubmitting:boolean;
    loadingText?:string;
    setModalContent:(content:ReactElement | null)=>void;
    setSubmitState:(state:{isSubmitting:boolean; loadingText?:string})=>void;
}

export const useSideModal = create<SideModalState>()((set)=>({
    modalContent:null,
    isSubmitting:false,
    loadingText:undefined,
    setModalContent: (content:ReactElement | null)=>set({modalContent:content, isSubmitting:false, loadingText:undefined}),
    setSubmitState: ({isSubmitting, loadingText})=>set({isSubmitting, loadingText})
}))


export interface RateValues {
    nhil?: number;
    getfund?: number;
    covid?: number;
    vat?: number;
}

interface RateValueState{
    rateValues:RateValues;
    setRateValues:(value:RateValues)=>void;
}

export const useRateValues = create<RateValueState>((set)=>({
    rateValues:{},
    setRateValues:(value:RateValues)=>set({rateValues:value}),
   
}))

interface IInvoiceItem {
    partNumber: string;
    description: string;
    unitPrice: number;
    quantity: number;
    amount: number;
}

interface IRateAmounts {
    nhilAmount: number;
    getfundAmount: number;
    covidAmount: number;
    vatAmount: number;
    total: number;
}

interface InvoiceItemsState {
    invoiceItems: IInvoiceItem[];
    rateAmounts?: IRateAmounts;
    setRateAmounts: (value: IRateAmounts) => void;
    setInvoiceItems: (value: IInvoiceItem[]) => void;
}

export const useInvoiceItems = create<InvoiceItemsState>((set) => ({
    invoiceItems: [],
    setInvoiceItems: (value: IInvoiceItem[]) => set({ invoiceItems: value }),
    rateAmounts: undefined,
    setRateAmounts: (value: IRateAmounts) => set({ rateAmounts: value }),
}))

