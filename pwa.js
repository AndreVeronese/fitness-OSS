/* ==========================================================
   PWA bootstrap: registro do Service Worker, detecção de modo
   standalone (instalado) e banner de instrução de instalação
   para iOS Safari (que não tem prompt de instalação nativo).
   ========================================================== */

/* ---------- 1) Registro do Service Worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((e) => console.error('SW falhou:', e));
  });
  // Quando uma nova versão assume o controle, recarrega UMA vez
  // para garantir que os arquivos novos (já cacheados) sejam usados.
  let refreshed = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshed) return;
    refreshed = true;
    location.reload();
  });
}

/* ---------- 2) Detecção de modo standalone (instalado) ----------
   Não depende só de User-Agent: usa a media query display-mode
   (padrão PWA) e, como reforço específico do iOS, navigator.standalone
   (propriedade não padronizada, mas exposta pelo próprio Safari/WebKit
   — não é uma checagem de string de User-Agent). */
function isStandalone() {
  const byMediaQuery = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const byIOSFlag = window.navigator.standalone === true;
  return !!(byMediaQuery || byIOSFlag);
}
window.PlatformProvider = window.PlatformProvider || {};
window.PlatformProvider.isStandalone = isStandalone;

/* ---------- 3) Banner de instalação (apenas iOS Safari, não instalado) ---------- */
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS
}
function isSafariBrowser() {
  const ua = navigator.userAgent;
  return /safari/i.test(ua) && !/crios|fxios|edgios|chrome/i.test(ua);
}

const INSTALL_DISMISS_KEY = 'fitnessos_install_banner_dismissed';

function showInstallBannerIfNeeded() {
  if (isStandalone()) return; // já instalado, nunca mostrar
  if (!isIOS() || !isSafariBrowser()) return; // só faz sentido nesse caminho no iOS/Safari
  if (StorageProvider.get(INSTALL_DISMISS_KEY) === '1') return; // usuário já dispensou

  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.style.cssText = `
    position:fixed; left:12px; right:12px;
    bottom:calc(12px + env(safe-area-inset-bottom,0px));
    background:#15181c; border:1px solid #262b31; border-radius:14px;
    padding:12px 14px; color:#eef1f3; font-family:-apple-system,sans-serif;
    font-size:13.5px; line-height:1.4; z-index:999; box-shadow:0 8px 24px rgba(0,0,0,.4);
  `;
  banner.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
      <div><b>Instale o FITNESS OS</b><br>
      Toque em <b>Compartilhar</b> (ícone de seta ⬆️ na barra do Safari) e depois em
      <b>Adicionar à Tela de Início</b>.</div>
      <button id="install-banner-close" style="background:none;border:none;color:#8b939c;font-size:16px;">✕</button>
    </div>`;
  document.body.appendChild(banner);
  document.getElementById('install-banner-close').onclick = () => {
    StorageProvider.set(INSTALL_DISMISS_KEY, '1');
    banner.remove();
  };
}

/* ---------- 4) Ajuste de interface quando já em standalone ---------- */
function applyStandaloneClass() {
  if (isStandalone()) document.documentElement.classList.add('is-standalone');
}

document.addEventListener('DOMContentLoaded', () => {
  applyStandaloneClass();
  showInstallBannerIfNeeded();
});
