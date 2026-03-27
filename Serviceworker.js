self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("pokedex-cache").then(cache => {
      return cache.addAll([
        "./",
        "index.html",
        "style.css",
        "script.js"
      ]);
    })
  );
});
