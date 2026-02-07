# Free Deployment Guide

This project is set up to be deployed for **free** using Vercel (Frontend) and Render (Backend).

## 1. Backend Deployment (Render)

Render offers a free tier for Dockerized web services.

1. Create a [Render account](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Select the repository `astroid_tracker_and_risk_analyzer`.
5. **Configuration**:
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Instance Type**: Free
   - **Environment Variables**:
     - `NASA_API_KEY`: Your key
     - `SECRET_KEY`: A random secret string
     - `DATABASE_URL`: `sqlite:///./data/cosmic_watch.db` (Note: SQLite data resets on deployment in free tier. use an external Postgres for persistence if needed)
6. Click **Create Web Service**.
7. **Copy the URL** (e.g., `https://cosmic-api.onrender.com`). You will need this for the frontend.

## 2. Frontend Deployment (Vercel)

Vercel is the standard for React/Vite deployment.

1. Create a [Vercel account](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Configuration**:
   - **Root Directory**: `fronten` (Important: Click 'Edit' next to Root Directory and type `fronten`)
   - **Framework Preset**: Vite (should detect automatically)
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: Paste your Render Backend URL (e.g., `https://cosmic-api.onrender.com`)
5. Click **Deploy**.

## 3. Local Docker Testing

To run everything locally with one command:

```bash
docker-compose up
```

Access:

- Frontend: http://localhost:80
- Backend: http://localhost:8000
