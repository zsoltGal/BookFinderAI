export function encodeQuery(q) {
  return encodeURIComponent(q.normalize('NFKC'));
}

export function safeLink(url) {
  try {
    const u = new URL(url, location.origin);
    return ['http:', 'https:'].includes(u.protocol) ? u.href : 'about:blank';
  } catch {
    return 'about:blank';
  }
}

export function forceHttps(url) {
  if (!url) return url;
  try {
    if (url.startsWith('http://')) return url.replace('http://', 'https://');
    return url;
  } catch {
    return url;
  }
}

export function safeImage(url, fallback) {
  try {
    const u = new URL(url, location.origin);
    if (['http:', 'https:', 'data:'].includes(u.protocol)) return u.href;
  } catch {}
  return fallback;
}

/* Vytvorí <img> s garantovaným fallbackom pri chybe načítania */
export function imgWithFallback(src, fallback, alt = '') {
  const img = document.createElement('img');
  img.alt = alt || 'cover';
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.src = safeImage(forceHttps(src), fallback);
  img.onerror = () => { img.src = fallback; };
  return img;
}

export function createEl(tag, className, text = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

