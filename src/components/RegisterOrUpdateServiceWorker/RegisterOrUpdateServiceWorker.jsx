'use client';

import { useEffect, useState } from 'react';

export default function RegisterOrUpdateServiceWorker() {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const onClickOverlay = (event) => {
        if (event.target === event.currentTarget) {
            setShowUpdateModal(false);
        }
    }

    const onClickRefreshPageButton = async () => {
        setShowUpdateModal(false);

        if (!('serviceWorker' in navigator)) {
            return;
        }

        const registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
            return;
        }

        if (registration.waiting) {
            // Let waiting Service Worker know it should become active
            registration.waiting.postMessage('SKIP_WAITING')
        }
    };

    useEffect(() => {
        const registerServiceWorker = async () => {
            // Check if the browser supports serviceWorker at all
            if (!('serviceWorker' in navigator)) {
                return;
            }

            // Register the service worker from the file specified
            const registration = await navigator.serviceWorker.register('/serviceWorker.js')

            // Ensure the case when the updatefound event was missed is also handled
            // by re-invoking the prompt when there's a waiting Service Worker
            if (registration.waiting) {
                setShowUpdateModal(true);
            }

            // Detect Service Worker update available and wait for it to become installed
            registration.addEventListener('updatefound', () => {
                if (!registration.installing) {
                    return;
                }

                // Wait until the new Service worker is actually installed (ready to take over)
                registration.installing.addEventListener('statechange', () => {
                    if (!registration.waiting) {
                        return;
                    }

                    // If there's an existing controller (previous Service Worker), show the prompt
                    if (navigator.serviceWorker.controller) {
                        setShowUpdateModal(true);
                    } else {
                        // Otherwise it's the first install, nothing to do
                    }
                })
            })

            let refreshing = false;

            // Detect controller change and refresh the page
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) {
                    return;
                }

                window.location.reload()
                refreshing = true
            })
        };

        registerServiceWorker();
    }, []);

    return showUpdateModal ? (
        <div
            className="fixed top-0 left-0 z-50 h-[100dvh] w-screen flex justify-center items-center bg-black bg-opacity-50"
            onClick={onClickOverlay}
        >
            <div className="w-11/12 bg-white ring-1 ring-gray-500 rounded-lg shadow-2xl md:w-auto">
                <div className="px-4 pt-5 md:px-6 md:pt-7">
                    <p className="text-base font-semibold leading-6 text-gray-900">A new version of PiSentry is available !</p>
                    <p className="mt-2 text-sm text-gray-600">Please reload the page to access the latest features.</p>
                </div>
                <div className="px-4 py-3 mt-4 bg-gray-50 rounded-b-lg md:px-6 flex md:justify-end">
                    <button
                        className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 md:w-auto"
                        onClick={onClickRefreshPageButton}
                    >
                        Refresh the page
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}
