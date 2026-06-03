import { ReactElement } from "react";

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};


export type ApiError = {
  message?: string;
};


export type MessageData = {
  message: string;
};



export type IBusiness = {
  id: string;
  ownerId: string;
  name: string;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  taxId: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
};


export interface IInvoice {
  id: string;
  businessId: string;
  clientId: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  nhilAmount: number;
  getfundAmount: number;
  covidAmount: number;
  vatAmount: number;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}


export interface IInvoiceItem {
    partNumber: string;
    description: string;
    unitPrice: number;
    quantity: number;
    amount: number;
}

export interface IRateAmounts {
    nhilAmount: number;
    getfundAmount: number;
    covidAmount: number;
    vatAmount: number;
    total: number;
}

export interface IClient {
   
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
}

export interface IClientState {
    client: IClient;
    setClient: (value: IClient | ((prev: IClient) => IClient)) => void;
}


export interface IInvoiceItemsState {
    invoiceItems: IInvoiceItem[];
    rateAmounts?: IRateAmounts;
    setRateAmounts: (value: IRateAmounts) => void;
    setInvoiceItems: (value: IInvoiceItem[]) => void;
}


export interface IRateValues {
    nhil?: number;
    getfund?: number;
    covid?: number;
    vat?: number;
}

export interface IRateValueState{
    rateValues:IRateValues;
    setRateValues:(value:IRateValues)=>void;
}


export interface ISideModalState{   
    modalContent:ReactElement | null;
    isSubmitting:boolean;
    loadingText?:string;
    setModalContent:(content:ReactElement | null)=>void;
    setSubmitState:(state:{isSubmitting:boolean; loadingText?:string})=>void;
}

export interface AuthState {
  userData: IUserData | null;
  token: string | null;
  hasHydrated: boolean;
  setUser: (userData: IUserData) => void;
  setToken: (token: string) => void;
  setAuth: (payload: { user: IUserData; token: string }) => void;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}


export type UserRole = "admin" | "user" | "guest";

export interface IUserData{
    id:string;
    fullName:string;
    email:string;
    role:UserRole;
    emailVerified:boolean;
}
