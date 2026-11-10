/**
 * Default consent preset: All cookie categories accepted.
 */
export const COOKIES_ALL = {
  necesarias: true,
  preferencias: true,
  analiticas: true,
  marketing: true
};

/**
 * Minimal consent preset: Only strictly necessary cookies allowed (GDPR compliant).
 */
export const COOKIES_NECCESSARY_ONLY = {
  necesarias: true,
  preferencias: false,
  analiticas: false,
  marketing: false
};

/**
 * Sets a browser cookie with expiration, root path, and SameSite policy.
 * Automatically serializes objects to JSON strings.
 *
 * @param {string} name - The key/name of the cookie.
 * @param {*} value - The value to store (string, number, boolean, or object).
 * @param {number} [days=365] - Validity duration in days (negative number deletes the cookie).
 */
export function setCookie(name, value, days = 365) {
  // Convert days to seconds for the standard max-age directive
  const maxAge = days * 24 * 60 * 60;

  // Serialize objects to JSON strings or keep primitive values as strings
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;

  // Write cookie string into document.cookie with URL encoding
  document.cookie = `${name}=${encodeURIComponent(stringValue)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  
}

/**
 * Retrieves and parses a cookie value by name.
 * Automatically attempts to parse JSON strings back into JavaScript objects.
 *
 * @param {string} name - The key/name of the cookie to retrieve.
 * @returns {*|null} The parsed value or null if the cookie does not exist.
 */
export function getCookie(name) {
  const cookies = document.cookie.split(';');
  
  // Iterate through all stored cookies
  for (let cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key === name) {
      // Reassemble and decode the URI-encoded value
      const rawValue = decodeURIComponent(valueParts.join('='));
      try {
        // Attempt JSON deserialization (for objects/arrays)
        return JSON.parse(rawValue);
      } catch {
        // Return raw decoded string if it is not valid JSON
        return rawValue;
      }
    }
  }
  return null;
}

/**
 * Removes a cookie from the browser immediately by setting a negative expiration age.
 *
 * @param {string} name - The key/name of the cookie to remove.
 */
export function deleteCookie(name) {
  setCookie(name, '', -1);
}
