const NOME_CACHE = "catalogo-decagel-v4";
const FILE_DA_SALVARE = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(NOME_CACHE).then((cache) => cache.addAll(FILE_DA_SALVARE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nomiCache) =>
      Promise.all(
        nomiCache
          .filter((nome) => nome !== NOME_CACHE)
          .map((nome) => caches.delete(nome))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  const url = new URL(evento.request.url);

  // Il file dei dati (dati.json) NON passa dalla cache del service worker:
  // lo gestisce direttamente la pagina (index.html), che decide da sola
  // se scaricarlo di nuovo o usare quello salvato in localStorage.
  if (url.pathname.endsWith("dati.json")) {
    return;
  }

  evento.respondWith(
    caches.match(evento.request).then((rispostaSalvata) => {
      return rispostaSalvata || fetch(evento.request);
    })
  );
});
