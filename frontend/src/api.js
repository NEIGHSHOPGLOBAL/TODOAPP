const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_URL = `${API_URL}/api/todos`;

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function getTodos() {
  return fetch(BASE_URL).then(handleResponse);
}

export function createTodo(title) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  }).then(handleResponse);
}

export function updateTodo(id, updates) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then(handleResponse);
}

export function deleteTodo(id) {
  return fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(handleResponse);
}
