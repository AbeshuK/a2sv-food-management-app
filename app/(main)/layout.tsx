import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    metadataBase: new URL('https://a2sv-food-app.vercel.app/pages/restaurants'), 
    title: 'A2SV Food Management App',
    description: 'Manage and explore featured foods and restaurants',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'A2SV Food Management App',
        url: 'https://a2sv-food-app.vercel.app/pages/restaurants',
        description: 'Manage and explore featured foods and restaurants',
        images: ['https://www.primefaces.org/static/social/sakai-react.png'],
        ttl: 604800,
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
