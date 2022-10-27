import '../styles/global.css';
import 'antd/dist/antd.css';
import { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}
