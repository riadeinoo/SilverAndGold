const BASE_URL = "https://jsonplaceholder.typicode.com";
const TIMEOUT_MS = 8000;

function makeError(type, status, message) {
  return { type, status, message };
}

export async function request(path, options = {}) {
  if (!navigator.onLine) {
    throw makeError("offline", 0, "Vous êtes hors-ligne. Vérifiez votre connexion puis réessayez.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const config = {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    signal: controller.signal,
  };
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  try {
    let response;
    try {
      response = await fetch(BASE_URL + path, config);
    } catch (err) {
      if (err.name === "AbortError") {
        throw makeError("timeout", 0, "Le serveur met trop de temps à répondre. Réessayez dans un instant.");
      }
      throw makeError("network", 0, "Impossible de joindre le serveur. Vérifiez votre connexion.");
    }

    if (!response.ok) {
      const message = response.status === 404
        ? "Élément introuvable (404)."
        : response.status >= 500
          ? `Erreur du serveur (${response.status}). Réessayez plus tard.`
          : `La requête a échoué (${response.status}).`;
      throw makeError("http", response.status, message);
    }

    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      throw makeError("parse", response.status, "La réponse du serveur est illisible.");
    }
  } finally {

    clearTimeout(timer);
  }
}