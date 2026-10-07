# To-Do App

A basic to-do app with a React (Vite) frontend and a Python Flask backend.

## Structure

- `backend/` — Flask REST API (SQLite via SQLAlchemy)
- `frontend/` — React app (Vite)

## Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Runs on `http://127.0.0.1:5000`. Endpoints:

| Method | Path              | Description       |
|--------|-------------------|--------------------|
| GET    | /api/todos        | List all todos     |
| POST   | /api/todos        | Create a todo      |
| PUT    | /api/todos/<id>   | Update a todo      |
| DELETE | /api/todos/<id>   | Delete a todo      |

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` (or next available port) and proxies `/api` requests to the Flask backend.

Run the backend and frontend in separate terminals, then open the frontend URL in your browser.
