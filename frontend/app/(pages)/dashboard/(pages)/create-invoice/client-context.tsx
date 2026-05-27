"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export interface ClientFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
}

const emptyClient: ClientFormData = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
};

type ClientFormContextValue = {
    client: ClientFormData;
    setClient: (value: ClientFormData | ((prev: ClientFormData) => ClientFormData)) => void;
    resetClient: () => void;
};

const ClientFormContext = createContext<ClientFormContextValue | null>(null);

export function ClientFormProvider({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<ClientFormData>(emptyClient);

    const value = useMemo<ClientFormContextValue>(() => ({
        client,
        setClient,
        resetClient: () => setClient(emptyClient),
    }), [client]);

    return (
        <ClientFormContext.Provider value={value}>
            {children}
        </ClientFormContext.Provider>
    );
}

export function useClientFormContext() {
    const context = useContext(ClientFormContext);

    if (!context) {
        throw new Error("useClientFormContext must be used within ClientFormProvider");
    }

    return context;
}
