'use client';

import { useEffect, useState, useRef } from 'react';

export default function RegisterOrUpdateServiceWorker() {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const overlayElementRef = useRef(null);

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

    const handleScroll = () => {
        if (overlayElementRef.current !== null) {
            overlayElementRef.current.style.top = `${window.pageYOffset}px`;
        }
    };

    useEffect(() => {
        // To keep the modal at the center of the screen even when the page can be scrolled down
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            className="absolute top-0 left-0 z-50 h-screen w-screen flex justify-center items-center bg-black bg-opacity-50"
            onClick={onClickOverlay}
            ref={overlayElementRef}
        >
            <div className="w-11/12 px-4 py-5 bg-white rounded-xl shadow-2xl md:w-auto md:px-6 md:py-7">
                <p className="font-bold text-lg">A new version of PiSentry is available !</p>
                <p className="mt-2">Please reload the page to access the latest features.</p>
                <button
                    className="block mx-auto mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white"
                    onClick={onClickRefreshPageButton}
                >
                    Refresh the page
                </button>
            </div>
        </div>
    ) : null;
}
