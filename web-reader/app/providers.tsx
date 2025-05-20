"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StoreProvider } from "@/store/Provider";
import { appStore } from "@/store/AppStore.store";
import { ApiInstant } from "@/utils/api";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  React.useEffect(() => {
    const token = appStore.token;
    if (token) {
      ApiInstant.get("/auth/profile")
        .then((res) => {
          appStore.setProfile(res.data);
        })
        .catch(() => {
          appStore.logout();
        });
    }
  }, []);

  return (
    <StoreProvider>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </StoreProvider>
  );
}
