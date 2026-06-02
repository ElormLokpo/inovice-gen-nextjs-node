import { ReactElement } from 'react';
import { create } from 'zustand'
import { persist } from 'zustand/middleware';

import {
    IUserData,
    IRateAmounts,
    RateValues,
    AuthState,
    IInvoiceItem,
    IClientState,
    InvoiceItemsState,
    RateValueState,
    SideModalState
} from '@/app/types';



export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        userData: null,
        token: null,
        hasHydrated: false,
        setUser: (userData: IUserData) => set({ userData }),
        setToken: (token: string) => set({ token }),
        setAuth: ({ user, token }) => set({ userData: user, token }),
        clearAuth: () => set({ userData: null, token: null }),
        setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
        {
            name: "authData",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    ))



export const useSideModal = create<SideModalState>()((set) => ({
    modalContent: null,
    isSubmitting: false,
    loadingText: undefined,
    setModalContent: (content: ReactElement | null) => set({ modalContent: content, isSubmitting: false, loadingText: undefined }),
    setSubmitState: ({ isSubmitting, loadingText }) => set({ isSubmitting, loadingText })
}))




export const useRateValues = create<RateValueState>((set) => ({
    rateValues: {},
    setRateValues: (value: RateValues) => set({ rateValues: value }),

}))




export const useInvoiceItems = create<InvoiceItemsState>((set) => ({
    invoiceItems: [],
    setInvoiceItems: (value: IInvoiceItem[]) => set({ invoiceItems: value }),
    rateAmounts: undefined,
    setRateAmounts: (value: IRateAmounts) => set({ rateAmounts: value }),
}))




export const useClients = create<IClientState>((set) => ({
    client: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
    },
    setClient: (value) => set((state) => ({
        client: typeof value === "function" ? value(state.client) : value,
    })),

}))
