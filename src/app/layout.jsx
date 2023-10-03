import './globals.scss'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    charset: 'utf-8',
        viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    title: {
        template: '%s | PiSentry',
        default: 'PiSentry',
    },
    description: 'Security camera service using Raspberry Pi',
    manifest: '/manifest.json',
    icons: {
        apple: '/assets/icons/apple-icon-180.png',
    },
    appleWebApp: {
        title: 'PiSentry',
        startupImage: [
            {
                url: '/assets/splash/apple-splash-2048-2732.jpg',
                media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2732-2048.jpg',
                media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1668-2388.jpg',
                media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2388-1668.jpg',
                media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1536-2048.jpg',
                media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2048-1536.jpg',
                media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1668-2224.jpg',
                media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2224-1668.jpg',
                media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1620-2160.jpg',
                media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2160-1620.jpg',
                media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1290-2796.jpg',
                media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2796-1290.jpg',
                media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1179-2556.jpg',
                media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2556-1179.jpg',
                media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1284-2778.jpg',
                media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2778-1284.jpg',
                media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1170-2532.jpg',
                media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2532-1170.jpg',
                media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1125-2436.jpg',
                media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2436-1125.jpg',
                media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1242-2688.jpg',
                media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2688-1242.jpg',
                media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-828-1792.jpg',
                media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-1792-828.jpg',
                media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-1242-2208.jpg',
                media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-2208-1242.jpg',
                media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-750-1334.jpg',
                media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-1334-750.jpg',
                media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
            {
                url: '/assets/splash/apple-splash-640-1136.jpg',
                media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/assets/splash/apple-splash-1136-640.jpg',
                media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
            },
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} h-screen max-h-screen md:w-[600px] md:m-auto md:shadow-2xl`}>
                {children}
            </body>
        </html>
    );
}