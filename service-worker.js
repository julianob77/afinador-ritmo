const CACHE_NAME = "afinador-pontograve-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./escalas.html",
  "./modos-gregos.html",
  "./pentatonicas.html",
  "./campo-harmonico.html",
  "./manifest.json",
  "./css/styles.css",
  "./css/escalas.css",
  "./css/modos-gregos.css",
  "./css/pentatonicas.css",
  "./css/campo-harmonico.css",
  "./js/sound-bank.js",
  "./js/rhythm-patterns.js",
  "./js/metronome-engine.js",
  "./js/pitch-detector.js",
  "./js/ui.js",
  "./js/app.js",
  "./js/escalas.js",
  "./js/modos-gregos.js",
  "./js/pentatonicas.js",
  "./js/campo-harmonico.js",
  "./icons/icon.svg",
  "./icons/logo-fundo-escuro.svg",
  "./icons/logo-fundo-claro.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Faixas de áudio: vêm direto da rede (arquivos grandes e pedidos em partes pelo player)
  if (new URL(event.request.url).pathname.endsWith(".mp3")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
