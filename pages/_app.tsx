import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import CookieNotice from '../components/CookieNotice';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <CookieNotice />
        </AuthProvider>
    );
} 