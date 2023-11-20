const showNotification = data => {
    const title = data.title || 'PiSentry';

    const options = {
        body: data.message || '',
        icon: data.icon || null,
        badge: './assets/icons/badge.png',
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
    } catch (e) {
        console.log('Exception caught while parsing json');
    }
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting(); // The promise returned by skipWaiting can be safely ignored as per Mozilla's documentation
    }
});

/**
 * TODO: when a notification is clicked, open the app to display the corresponding recording
 */
// self.addEventListener('notificationclick', (event) => {
//     console.log('[Service Worker] Notification click received.');
//
//     event.notification.close(); // close the notification that was clicked
//
//     event.waitUntil(clients.openWindow('https://developers.google.com/web')); // load the URL in the app
// });
