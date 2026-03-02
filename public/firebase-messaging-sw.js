importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "{{VITE_API_KEY}}",
  projectId: "{{VITE_PROJECT_ID}}",
  messagingSenderId: "{{VITE_MESSAGING_SENDER_ID}}",
  appId: "{{VITE_APP_ID}}",
});

const messaging = firebase.messaging();

// Background 알림 수신
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message:', payload);

  const notificationTitle = payload.notification?.title || '이루연';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 창이 있으면 focus
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 없으면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
