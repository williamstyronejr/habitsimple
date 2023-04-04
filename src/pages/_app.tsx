import Head from 'next/head';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SkipNavigation from '@/components/ui/SkipNavigation';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col flex-nowrap w-full h-full">
        <Toaster />
        <Head>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <SkipNavigation />

        <main id="content" className="flex-grow">
          <Component {...pageProps} />
        </main>
      </div>
    </QueryClientProvider>
  );
}
