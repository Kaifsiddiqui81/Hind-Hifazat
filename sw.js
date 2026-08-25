const CACHE_NAME = 'hind-hifazat-v3';
const OFFLINE_NUMBERS = [
  { label: 'National Emergency', number: '112' },
  { label: 'Police', number: '100' },
  { label: 'Fire', number: '101' },
  { label: 'Ambulance', number: '108' },
  { label: 'Cyber Fraud', number: '1930' }
];

const urlsToCache = [
  '/',
  '/report',
  '/cyber-suraksha',
  '/manifest.json',
  '/icons/hind-hifazat-icon.svg',
  '/icons/hind-hifazat-maskable.svg',
  '/icons/public-help-icon.svg',
  '/icons/public-help-maskable.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    // Removed self.skipWaiting() to prevent version-skew FOUC during active sessions
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.pathname === '/offline-emergency-numbers.json') {
    event.respondWith(Response.json({ numbers: OFFLINE_NUMBERS }));
    return;
  }

  // Do NOT cache API requests, medical-id, or admin routes
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/medical-id') || 
      url.pathname.startsWith('/admin') ||
      url.hostname !== self.location.hostname) {
    return; // Fall through to standard network request without custom SW caching
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful responses (prevent caching 404s/500s)
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('/');
        return Response.json({ ok: false, offline: true, numbers: OFFLINE_NUMBERS }, { status: 503 });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => cacheName === CACHE_NAME ? undefined : caches.delete(cacheName))
    ))
    // Removed self.clients.claim() to let standard lifecycle apply cleanly
  );
});

// IndexedDB Helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('hind-hifazat-queue', 1);
    request.onupgradeneeded = event => {
      event.target.result.createObjectStore('sos-requests', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

self.addEventListener('sync', event => {
  if (event.tag === 'hind-hifazat-offline-sos' || event.tag === 'public-help-offline-sos') {
    event.waitUntil(
      (async () => {
        try {
          const db = await openDB();
          const tx = db.transaction('sos-requests', 'readonly');
          const store = tx.objectStore('sos-requests');
          const requests = await new Promise(resolve => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
          });
          
          for (const item of requests) {
            try {
              const res = await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.payload)
              });
              if (res.ok) {
                const delTx = db.transaction('sos-requests', 'readwrite');
                delTx.objectStore('sos-requests').delete(item.id);
              }
            } catch (err) {
              console.error('Failed to sync item', item.id, err);
            }
          }
        } catch (err) {
          console.error('Sync failed', err);
        }
      })()
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === '5KM_RADIUS_ALERT') {
    const alertData = event.data.alertData || {};
    self.registration.showNotification('📍 5KM RADIUS EMERGENCY ALERT', {
      body: `${alertData.label || 'Emergency'} SOS triggered within 5.0 km of your location! Stay alert or offer assistance.`,
      icon: '/icons/hind-hifazat-icon.svg',
      badge: '/icons/hind-hifazat-icon.svg',
      vibrate: [300, 100, 300, 100, 500],
      tag: '5km-radius-sos',
      renotify: true
    });
  }
});

