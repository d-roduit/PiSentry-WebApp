'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FetchRequest from '@/helpers/FetchRequest.js';
import urls from '@/urls.js';

const { streamingApiEndpoint, notificationsApiEndpoint } = urls;

export default function HomePage() {

    const [pushSubscription, setPushSubscription] = useState(null);

    useEffect(() => {
        registerServiceWorker();
    }, []);

    /**
     * Streaming action buttons
     */
    const onClickStartStreamingButton = () =>
        new FetchRequest(`${streamingApiEndpoint}/1/start`)
            .options({
                method: 'POST',
                headers: { Authorization: 'mytoken' }
            })
            .make();

    const onClickStopStreamingButton = () =>
        new FetchRequest(`${streamingApiEndpoint}/1/stop`)
            .options({
                method: 'POST',
                headers: { Authorization: 'mytoken' }
            })
            .make();

    /**
     * Push notifications
     */
    const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push API are supported');

            try {
                const serviceWorkerRegistration= await navigator.serviceWorker.register('/serviceWorker.js');
                console.log('service worker registration:', serviceWorkerRegistration);
            } catch (err) {
                console.error('Service Worker Error:', err);
            }
        } else {
            console.warn('Push messaging is not supported');
        }
    };

    const onClickSubscribePushNotificationsButton = async () => {
        try {
            const serviceWorkerRegistration = await navigator.serviceWorker.ready;
            setPushSubscription(await serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BDMJlhUeJ0cPUbzzGjZpKBhuPV7XoxaCW2RAFY7gIBrg65JIUCE3Ryxutn5NX1FdA5e1w28y45WTi38aqJZ4FSQ' // encoded in Base64
            }));

            // TODO: Send push subscription to the backend to put it in the DB
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <header>
                <nav className="my-2 ml-2">
                    <Link href="/" className="bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-400 rounded shadow">Home</Link>
                    <Link href="/recordings" className="bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-400 rounded shadow ml-3">Recordings</Link>
                </nav>
            </header>
            <main>
                <div className="flex flex-col items-center pt-24">
                    <h1 className="text-2xl">Hello on PiSentry !</h1>

                    <div className="mt-3">
                        <button
                            onClick={onClickStartStreamingButton}
                            className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow"
                        >
                            Start streaming
                        </button>
                        <button
                            onClick={onClickStopStreamingButton}
                            className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow ml-3"
                        >
                            Stop streaming
                        </button>
                    </div>

                    <div className="mt-3">
                        <button
                            onClick={onClickSubscribePushNotificationsButton}
                            className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow"
                        >
                            Subscribe to push notification
                        </button>
                    </div>

                    {pushSubscription !== null && (
                        <p className="py-2 px-4 border border-gray-400">
                            <b>Subscription:</b>
                            <br/>
                            {JSON.stringify(pushSubscription)}
                        </p>
                    )}
                </div>
            </main>
        </>
    )
}
