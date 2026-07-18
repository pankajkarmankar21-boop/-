// Custom additions layered on top of next-pwa's generated service worker.
// next-pwa's build step injects the Workbox precache manifest into this file
// at build time (via the `swSrc` option in next.config.js).

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "किसान जुताई", body: event.data.text() };
  }

  const options = {
    body: payload.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data || {},
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(payload.title || "किसान जुताई", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const existing = clientsArr.find((c) => c.url.includes(targetUrl));
      if (existing) return existing.focus();
      return self.clients.openWindow(targetUrl);
    })
  );
});
