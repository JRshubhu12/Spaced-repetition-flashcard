
"use client";

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    alert('This browser does not support desktop notifications.');
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'default'; // or 'denied' depending on how you want to handle errors
  }
}

export function showSimpleNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    // Ensure the service worker is ready (optional, but good practice for future extension)
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
         navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, { body, tag });
        }).catch(err => {
            // Fallback if service worker fails or not yet implemented for notifications
            console.warn('Service worker not ready for notification, falling back to new Notification()', err);
            new Notification(title, { body, tag });
        });
    } else {
        // Fallback if service worker not supported or not ready
        new Notification(title, { body, tag });
    }

  } else if (Notification.permission === 'default') {
    console.warn('Notification permission has not been granted yet.');
    // It's generally better to request permission via a user action (button click)
    // rather than automatically when trying to show a notification.
  } else {
    console.warn('Notification permission was denied.');
  }
}
