import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import CookieNotice from '../components/CookieNotice';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <CartProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <CookieNotice />
            </CartProvider>
        </AuthProvider>
    );
} 