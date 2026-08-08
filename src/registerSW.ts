export function registerServiceWorker(onOfflineChange?: (isOffline: boolean) => void) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado con éxito en scope:', registration.scope);
        })
        .catch((error) => {
          console.error('[PWA] Error al registrar Service Worker:', error);
        });
    });
  }

  // Monitor online / offline network state changes
  window.addEventListener('offline', () => {
    console.log('[PWA] Conexión perdida - Modo Offline Cúpula');
    if (onOfflineChange) onOfflineChange(true);
  });

  window.addEventListener('online', () => {
    console.log('[PWA] Conexión restablecida - Ecosistema Sincronizado');
    if (onOfflineChange) onOfflineChange(false);
  });
}
