export const SIGNATURE_WELCOME_EVENT = 'signature-welcome-change'

declare global {
  interface Window {
    __signatureWelcome?: 'preparing' | 'assembling' | 'leaving'
  }
}

// Runs before first paint; the welcome also completes without React hydration.
export const signatureWelcomeScript = `(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  try {
    if (preference.matches || sessionStorage.getItem('signature-assembly-seen')) return;
    sessionStorage.setItem('signature-assembly-seen', '1');
  } catch { return; }

  const root = document.documentElement;
  let finished = false;
  const publish = (phase) => {
    if (phase) {
      window.__signatureWelcome = phase;
      root.setAttribute('data-signature-welcome', phase);
    } else {
      delete window.__signatureWelcome;
      root.removeAttribute('data-signature-welcome');
    }
    window.dispatchEvent(new Event('${SIGNATURE_WELCOME_EVENT}'));
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(watchdog);
    document.removeEventListener('animationstart', onAnimation);
    document.removeEventListener('animationend', onAnimation);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('DOMContentLoaded', prepare);
    preference.removeEventListener('change', onPreference);
    window.removeEventListener('pagehide', finish);
    publish();
  };
  const onAnimation = (event) => {
    if (!event.target.hasAttribute?.('data-signature-welcome')) return;
    if (event.type === 'animationstart') publish('leaving');
    else finish();
  };
  const onKey = (event) => { if (event.key === 'Escape') finish(); };
  const onPreference = () => { if (preference.matches) finish(); };
  const prepare = () => {
    const theme = root.classList.contains('dark') ? 'dark' : 'light';
    Promise.all(['a1', 'n', 'a2', 's'].map((letter) => {
      const image = new Image();
      image.src = '/brand/letter-' + letter + '-front-' + theme + '.webp';
      return image.decode();
    })).then(() => {
      if (!finished) publish('assembling');
    }, finish);
  };
  const watchdog = window.setTimeout(finish, 4000);
  document.addEventListener('animationstart', onAnimation);
  document.addEventListener('animationend', onAnimation);
  document.addEventListener('keydown', onKey);
  preference.addEventListener('change', onPreference);
  window.addEventListener('pagehide', finish);
  publish('preparing');
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, { once: true });
  else prepare();
})()`
