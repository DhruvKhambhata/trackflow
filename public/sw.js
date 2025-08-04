const CACHE_NAME = "trackflow-v4"
const urlsToCache = [
  "/",
  "/dashboard",
  "/login",
  "/register",
  "/log",
  "/analytics",
  "/activities/new",
  "/settings",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/browserconfig.xml",
]

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache resources:", error)
      })
    }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return (
        response ||
        fetch(event.request).catch(() => {
          // If both cache and network fail, return offline page for navigation requests
          if (event.request.destination === "document") {
            return caches.match("/")
          }
        })
      )
    }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Push notification received")

  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || "Don't forget to log your daily activities!",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || "/dashboard",
      },
      actions: [
        {
          action: "explore",
          title: "Open App",
          icon: "/icon-192x192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon-192x192.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title || "TrackFlow Reminder", options))
  }
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked")
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/dashboard"))
  } else if (event.action === "close") {
    event.notification.close()
  } else {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/dashboard"))
  }
})
