
const AUTH_EXPIRED_EVENT = "auth:expired";

export function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  // Attach a token only when one exists.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }

  const requestOptions = {
    ...options,
    headers,
  };

  if (options.body !== undefined && options.body !== null) {
    requestOptions.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  let response;

  try {
    response = await fetch(`/api${path}`, requestOptions);
  } catch {
    throw new Error(
      "Cannot connect to the server. Make sure the backend is running on port 5000."
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : {};

  // If a saved token has expired or is invalid, clear the session.
  if (
    response.status === 401 &&
    token &&
    !path.startsWith("/auth/login") &&
    !path.startsWith("/auth/register")
  ) {
    clearStoredAuth();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}
