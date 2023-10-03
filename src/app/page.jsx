'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import videojs from 'video.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import urls from '@/urls.js';

const { backendApiUrl, mediaServerUrl } = urls;

export default function HomePage() {

    const [pushSubscription, setPushSubscription] = useState(null);
    const [videojsOptions, setVideojsOptions] = useState(null);

    const playerRef = useRef(null);

    useEffect(() => {
        initializeVideojsOptions();
        registerServiceWorker();
    }, []);


    /**
     * Video VideoPlayer
     */
    const initializeVideojsOptions = async () => {
        const flvjs = await import('flv.js');
        window.flvjs = flvjs;

        const options = {
            controls: true,
            playsinline: true,
            userActions: {
                // click: (ev) => {
                //     const videoElement = ev.currentTarget;
                //     if (videoElement.paused) {
                //         console.log('videoElement', videoElement);
                //
                //         videoElement.currentTime = myPlayer.liveTracker.seekableEnd() - 0.5;
                //         videoElement.play();
                //         return;
                //     }
                //     videoElement.pause();
                // }
            },
            bigPlayButton: true,
            controlBar: {
                playToggle: false,
                volumePanel: false,
                currentTimeDisplay: false,
                timeDivider: false,
                durationDisplay: false,
                progressControl: {
                    seekBar: false
                },
                remainingTimeDisplay: false,
                pictureInPictureToggle: false,
                fullscreenToggle: true,
            },
            // sources: [{
            //     src: `${mediaServerUrl}/PiSentry/Spooky_Stream/index.m3u8`,
            //     type: 'application/x-mpegURL',
            // }]
        };

        if (flvjs.isSupported()) {
            // console.log('flv supported');
            // options.flvjs = {
            //     mediaDataSource: {
            //         type: 'flv',
            //         isLive: true,
            //         cors: true,
            //         withCredentials: false,
            //     },
            // };

            options.sources = [{
                src: `${mediaServerUrl}/PiSentry/Spooky_Stream.flv`,
                type: 'video/x-flv',
            }];
        }

        setVideojsOptions(options);
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    /**
     * Streaming action buttons
     */
    const onClickStartStreamingButton = () =>
        new FetchRequest(`${backendApiUrl}/v1/streaming/start`)
            .options({
                method: 'POST',
                headers: { Authorization: 'mytoken' }
            })
            .make();

    const onClickStopStreamingButton = () =>
        new FetchRequest(`${backendApiUrl}/v1/streaming/stop`)
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
                const serviceWorkerRegistration= await navigator.serviceWorker.register('../serviceWorker.js');
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
                <nav className="my-5 ml-2">
                    <Link href="/" className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow">Home</Link>
                    <Link href="/recordings" className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow ml-3">Recordings</Link>
                </nav>
            </header>
            <main>
                <div className="flex flex-col items-center pt-24">
                    <h1 className="text-2xl">Hello on the stream !</h1>

                    {videojsOptions !== null && (
                        <VideoPlayer options={videojsOptions} onReady={handlePlayerReady} className="mt-10" />
                    )}

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
