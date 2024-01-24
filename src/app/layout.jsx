import './globals.scss'
import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/lib/redux/ReduxProvider.jsx';
import ClosePushNotifications from '@/components/ClosePushNotifications/ClosePushNotifications.jsx';
import RegisterOrUpdateServiceWorker
    from '@/components/RegisterOrUpdateServiceWorker/RegisterOrUpdateServiceWorker.jsx';
import FetchRequest from '@/helpers/FetchRequest.js';
import urls from '@/urls.js';

const { camerasApiEndpoint, streamingApiEndpoint } = urls;

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#ffffff',
};

export const metadata = {
    applicationName: 'PiSentry',
    charset: 'utf-8',
    title: {
        template: '%s | PiSentry',
        default: 'PiSentry',
    },
    description: 'Security camera service using Raspberry Pi',
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
            { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: {
            url: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
        },
        other: [
            {
                rel: 'mask-icon',
                url: '/assets/icons/apple/safari-pinned-tab.svg',
                color: '#4338ca',
            }
        ],
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
    other: {
        'msapplication-TileColor': '#ffffff',
        'msapplication-TileImage': '/assets/icons/windows/mstile-144x144.png', // used by Windows 8.0 and IE 10 only
        'msapplication-config': '/browserconfig.xml', // used by Windows 8.1 and 10 with IE 11
    }
};

const startAllCameraStreams = async () => {
    await new FetchRequest(camerasApiEndpoint)
        .options({
            method: 'GET',
            headers: { Authorization: 'mytoken' },
        })
        .responseType(FetchRequest.ResponseType.Json)
        .success(async (cameras) => {
            const fetchRequestsPromises = cameras.map((camera) => (
                new FetchRequest(`${streamingApiEndpoint}/${camera.camera_id}/start`)
                    .options({
                        method: 'POST',
                        headers: { Authorization: 'mytoken' },
                        next: { revalidate: 0 },
                    })
                    .make()
            ));

            try {
                await Promise.all(fetchRequestsPromises);
            } catch (err) {
                console.log('Exception caught while starting all camera streams');
            }
        })
        .exception(() => console.log('Exception caught while fetching cameras'))
        .make();
};

export default async function RootLayout({ children }) {
    await startAllCameraStreams();

    return (
        <ReduxProvider>
            <html lang="en">
                <body className={inter.className}>
                    <RegisterOrUpdateServiceWorker />
                    <ClosePushNotifications />
                    <div className="min-h-screen h-full select-none md:w-[600px] md:m-auto md:shadow-2xl">
                        {children}
                    </div>
                </body>
            </html>
        </ReduxProvider>
    );
}
