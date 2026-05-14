"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuthStore } from "../store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";


const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);


  const isPublicRoute = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/confirm-email"].includes(pathname);

  useEffect(() => {
    const unsub = useAuthStore.subscribe((state) => {
      if (!state.token && !isPublicRoute) {
        router.replace("/login");
      }
    });

    return () => unsub();
  }, [router, isPublicRoute]);


  useEffect(() => {
    if (hasHydrated && !token && !isPublicRoute) {
      router.replace("/login");
    }
  }, [hasHydrated, token, isPublicRoute, router]);


  if (!hasHydrated) return null;


  if (!token && !isPublicRoute) return null;

  return <>{children}</>;
};


export default function Providers({ children }: { children: React.ReactNode }) {

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <AuthGuard>{children}</AuthGuard>

    </QueryClientProvider>
  );
}
