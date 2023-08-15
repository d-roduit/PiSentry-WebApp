const sendNotification = body => {
    const title = "New detection";

    const options = {
        body,
        icon: './images/icon.png',
        badge: './images/badge.png',
        // timestamp: // unix time in milliseconds, represent the time at which the notification was sent
    };

    return self.registration.showNotification(title, options);
};

self.addEventListener('push', (event) => {
    console.log('event:', event);
    if (event.data) {
        const message = event.data.text();
        const notificationPromise = sendNotification(message);
        event.waitUntil(notificationPromise);
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
