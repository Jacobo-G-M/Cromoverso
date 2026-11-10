export const COOKIES_ALL = {
  necesarias: true,
  preferencias: true,
  analiticas: true,
  marketing: true
};

export const COOKIES_NECCESSARY_ONLY = {
  necesarias: true,
  preferencias: false,
  analiticas: false,
  marketing: false
};

export function setCookie(name, value, days = 365) {
  const maxAge = days * 24 * 60 * 60;

  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
  document.cookie = `${name}=${encodeURIComponent(stringValue)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  
}

export function getCookie(name) {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key === name) {
      const rawValue = decodeURIComponent(valueParts.join('='));
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    }
  }
  return null;
}

export function deleteCookie(name) {
  setCookie(name, '', -1);
}
