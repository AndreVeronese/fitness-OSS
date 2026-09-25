/* ==========================================================
   PlatformProvider
   Camada conceitual para não prender o app ao navegador.
   NENHUMA integração nativa é feita nesta etapa (sem HealthKit,
   sem câmera, sem scanner, sem notificações) — apenas a
   abstração que permitirá plugar um IOSProvider real no futuro,
   quando plugins do Capacitor (Camera, BarcodeScanner, Health,
   PushNotifications, Geolocation, etc.) forem adicionados.
   ========================================================== */
window.PlatformProvider = {
  get current() {
    const isNative = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
    return isNative ? (window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'ios') : 'web';
  },
  isNative() {
    return this.current !== 'web';
  }
};
