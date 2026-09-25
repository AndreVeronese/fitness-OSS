/* ==========================================================
   StorageProvider
   Abstração sobre o armazenamento local do app.
   Hoje: implementado com localStorage (Web/WKWebView).
   Futuro: pode ser substituído por SQLite nativo (ex.: plugin
   @capacitor-community/sqlite ou @capacitor/preferences) sem
   alterar nenhuma outra parte do app — basta reimplementar
   estes 4 métodos com a mesma assinatura.
   ========================================================== */
window.StorageProvider = {
  get(key) {
    try { return localStorage.getItem(key); }
    catch (e) { console.error('StorageProvider.get falhou:', e); return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (e) { console.error('StorageProvider.set falhou:', e); return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); return true; }
    catch (e) { console.error('StorageProvider.remove falhou:', e); return false; }
  },
  clear() {
    try { localStorage.clear(); return true; }
    catch (e) { console.error('StorageProvider.clear falhou:', e); return false; }
  }
};

/* ==========================================================
   Utilitário de data LOCAL (corrige bug de timezone).
   NUNCA usar new Date().toISOString().slice(0,10) para
   determinar "o dia de hoje" do usuário — isso usa o fuso UTC
   e pode registrar o evento no dia errado perto da meia-noite
   no horário do Brasil (UTC-3). Esta função usa os componentes
   locais do aparelho (getFullYear/getMonth/getDate).
   ========================================================== */
function getLocalDateString(d) {
  d = d || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
