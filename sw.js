const staticCacheName = 'static-site-v2';
const dynamicCache = 'dynamic-site-v3'
const assets = [
	'/',
	'/index.html',
	'/js/app.js',
	'/js/ui.js',
	'/css/styles.css',
	'/css/materialize.min.css',
	'/img/dish.png',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

// install service worker
self.addEventListener('install', evt =>{
	//console.log('service worker has been installed');
	evt.waitUntil(
		caches.open(staticCacheName).then(cache => {
			cache.addAll(assets);
		})
	);
});

// activate service worker
self.addEventListener('activate', evt => {
	//console.log('service worker has been activated');
	evt.waitUntil(
		caches.keys().then(keys =>{
			console.log(keys);
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			)
		})
	);
});

// fetch event
self.addEventListener('fetch', evt =>{
	//console.log('fetch event', evt);
	evt.respondWith(
		caches.match(evt.request).then(cacheRes =>{
			return cacheRes || fetch(evt.request).then(fetchRes => {
				return caches.open(dynamicCache).then(cache => {
					cache.put(evt.request.url, fetchRes.clone());
						return fetchRes;
				})
			});
		})
	);
});
