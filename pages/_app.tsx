import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'regenerator-runtime/runtime'
import { SessionProvider } from "next-auth/react"
import { useRouter } from 'next/router';
import { useEffect } from 'react';


function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  const router = useRouter();

  useEffect(() => {
    const pageview = (url: URL): void => {
      //@ts-ignore
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    };
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
