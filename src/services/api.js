const API_URL = process.env.REACT_APP_API_URL || "https://backend-pasovit.onrender.com";

async function request(
  path,
  { method = "GET", body = null, headers = {} } = {}
) {
  const opts = {
    method,
    credentials: "include",
    headers: { ...headers },
  };

  if (body && !(body instanceof FormData)) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    opts.body = body;
  }

  const res = await fetch(`${API_URL}${path}`, opts);
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.message || res.statusText || "API error";

    // 🔥 FIX: Throw proper error object (ESLint no-throw-literal)
    const err = new Error(message);
    err.status = res.status;
    err.data = data;

    throw err;
  }

  return data;
}

export const apiGet = (path) => request(path, { method: "GET" });
export const apiPost = (path, body) => request(path, { method: "POST", body });
export const apiPut = (path, body) => request(path, { method: "PUT", body });
export const apiDelete = (path) => request(path, { method: "DELETE" });
