'use client';

import { useEffect } from 'react';

const closePushNotifications = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        console.log('Service Worker, Push API, or both are not supported');
        return;
    }

    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    const notifications = await serviceWorkerRegistration.getNotifications();

    for (const notification of notifications) {
        notification.close();
    }
};

const onVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
        await closePushNotifications();
    }
};

export default function ClosePushNotifications() {

    useEffect(() => {
        closePushNotifications();

        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, []);

    return null;
}
