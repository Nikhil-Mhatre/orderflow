// frontend/src/providers/query-provider.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provides TanStack Query to the frontend application.
 *
 * A QueryClient is created once per browser session rather than
 * on every render.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * Avoid unnecessary immediate refetches when a component
             * mounts again.
             */
            staleTime: 1_000,

            /**
             * Retry failed requests twice by default.
             */
            retry: 2,

            /**
             * Don't refetch every query whenever the browser window
             * receives focus.
             *
             * Our order-status hook has its own polling interval.
             */
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
