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

## Production deployment (VPS + Nginx)

Frontend and backend are deployed on separate subdomains:

- `https://todo.neighshopglobal.com` — static React build, served by Nginx
- `https://backend.neighshopglobal.com` — Flask API, served by Gunicorn behind Nginx

Config templates are in `deploy/`.

### 1. Backend (on the server)

```bash
cd /var/www/todoapp/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

sudo cp ../deploy/todoapp-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now todoapp-backend
```

The service sets `CORS_ORIGINS=https://todo.neighshopglobal.com,https://staging.todo.neighshopglobal.com` and runs Gunicorn on `127.0.0.1:8000`. Adjust `DATABASE_URL` in the unit file if you move the SQLite file (or point it at Postgres/MySQL).

### 2. Frontend (build locally or on the server)

```bash
cd frontend
npm install
npm run build        # uses .env.production -> VITE_API_URL=https://backend.neighshopglobal.com
```

Copy the resulting `dist/` to `/var/www/todoapp/frontend/dist` on the server.

### 3. Nginx

```bash
sudo cp deploy/nginx/todo.neighshopglobal.com.conf /etc/nginx/sites-available/
sudo cp deploy/nginx/backend.neighshopglobal.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/todo.neighshopglobal.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/backend.neighshopglobal.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. TLS

Point both DNS records (`todo` and `backend`) at the server's IP, then issue certificates:

```bash
sudo certbot --nginx -d todo.neighshopglobal.com -d backend.neighshopglobal.com
```
