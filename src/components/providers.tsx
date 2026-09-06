import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 12_000,
        retry: (count, err) => {
          if (err instanceof Error && err.message === "Unauthorized") return false;
          return count < 1;
        },
      },
    },
  });
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(makeClient);
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          className:
            "!bg-surface !text-fg !border-line !rounded-xl !font-[Outfit,sans-serif] !text-sm",
        }}
      />
    </QueryClientProvider>
  );
}
