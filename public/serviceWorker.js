const showNotification = data => {
    const title = data.title || 'PiSentry';

    const options = {
        body: data.message || '',
        icon: data.icon || null,
        badge: './assets/icons/notification-badge.png',
        timestamp: data.timestamp || null // unix time in milliseconds, represent the time at which the notification was sent
    };

    return self.registration.showNotification(title, options);
};

self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    try {
        const notificationData = event.data.json();
        const showNotificationPromise = showNotification(notificationData);
        event.waitUntil(showNotificationPromise);
    } catch (err) {
        console.log('Exception caught while parsing json:', err);
    }
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting(); // The promise returned by skipWaiting can be safely ignored as per Mozilla's documentation
    }
});

self.addEventListener('activate', (event) => {
    // When the new service-worker becomes activated, we claim all the opened clients,
    // they can be standalone PWA windows or browser tabs
    event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', async (event) => {
    try {
        await self.clients.openWindow('/'); // load the URL in the app
    } catch (err) {
        console.log('Exception caught in notification onclick handler:', err);
    }
});
