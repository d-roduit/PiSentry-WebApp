'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal/Modal.jsx';

export default function RegisterOrUpdateServiceWorker() {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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
        <Modal
            header={
                <p className="text-lg font-semibold leading-6 text-gray-900">
                    A new version of PiSentry is available !
                </p>
            }
            body={
                <div className="space-y-4">
                    <p className="text-base text-gray-600 leading-relaxed">
                        Please reload the page to access the latest features.
                    </p>
                </div>
            }
            footer={
                <div className="flex sm:justify-end">
                    <button
                        className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm text-center font-medium shadow-sm hover:bg-indigo-700 sm:w-auto"
                        onClick={onClickRefreshPageButton}
                    >
                        Refresh the page
                    </button>
                </div>
            }
            closeButton={true}
            onClickOverlay={() => setShowUpdateModal(false)}
            onClickCloseButton={() => setShowUpdateModal(false)}
        />
    ) : null;
}
