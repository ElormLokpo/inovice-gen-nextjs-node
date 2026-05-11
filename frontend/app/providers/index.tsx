"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuthStore } from "../store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";


const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state: any) => state.token);
  const [isHydrated, setIsHydrated] = useState(false);


  const isPublicRoute = pathname === "/login" || pathname === "/register" || pathname === "/";

  useEffect(() => {
    setIsHydrated(true);


    const unsub = useAuthStore.subscribe((state: any) => {
      if (!state.token && !isPublicRoute) {
        router.replace("/");
        router.refresh();
      }
    });

    return () => unsub();
  }, [router, isPublicRoute]);;


  useEffect(() => {
    if (isHydrated && !token && !isPublicRoute) {
      router.replace("/");
    }
  }, [isHydrated, token, isPublicRoute, router]);


  if (!isHydrated) return null;


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
      <Toaster position="top-center" richColors />
      {/* <AuthGuard>{children}</AuthGuard> */}
      {children}

    </QueryClientProvider>
  );
}