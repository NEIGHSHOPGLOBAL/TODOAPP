import { useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./api";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      const todo = await createTodo(trimmed);
      setTodos((prev) => [todo, ...prev]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  async function submitEdit(id) {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    try {
      const updated = await updateTodo(id, { title: trimmed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setEditingId(null);
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="status">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="status">No tasks yet. Add one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              />

              {editingId === todo.id ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editingTitle}
                  autoFocus
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => submitEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitEdit(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span className="title" onDoubleClick={() => startEditing(todo)}>
                  {todo.title}
                </span>
              )}

              <button className="delete-btn" onClick={() => handleDelete(todo.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <p className="footer">
          {remaining} {remaining === 1 ? "task" : "tasks"} remaining
        </p>
      )}
    </div>
  );
}

export default App;
