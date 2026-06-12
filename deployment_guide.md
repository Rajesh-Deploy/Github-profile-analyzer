# GitHub Profile Analyzer Deployment Guide

This guide covers how to deploy the backend API and frontend React UI independently from this monorepo repository.

## Project Structure

```text
root/
├── backend/                  # Standalone Express API Service
│   ├── src/
│   ├── .env.example
│   └── package.json
├── frontend/                 # Standalone React + Vite Client
│   ├── src/
│   ├── .env.example
│   └── package.json
├── package.json              # Monorepo Workspace configuration
└── deployment_guide.md       # This file
```

---

## 1. Backend Deployment (Railway)

### Step 1: Provision MySQL
1. Go to your **Railway** dashboard.
2. Click **New Project** -> **Provision MySQL**.
3. Railway will spin up a MySQL service. It will automatically inject environment variables like `MYSQL_URL`, `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, and `MYSQLPASSWORD`.

### Step 2: Deploy Backend Service
1. Click **New Service** -> **GitHub Repo** and connect your repository.
2. Go to the newly created service's **Settings** tab.
3. Under **General**, change the **Root Directory** to `/backend`. (This tells Railway to deploy only the backend code).
4. Under the **Variables** tab, ensure you add the following variables:
   * `PORT`: Railway automatically injects and binds this.
   * `NODE_ENV`: Set to `production`.
   * `MYSQL_URL`: Reference the MySQL service URL. (In Railway, you can link the variable from your MySQL service using `${{MySQL.MYSQL_URL}}` or copy it manually).
   * `GITHUB_TOKEN`: Your GitHub Personal Access Token (highly recommended to bypass rate limits).
   * `GITHUB_API_BASE_URL`: `https://api.github.com`.
5. Under **Settings**, click **Generate Domain** to get a public URL for your backend (e.g. `https://your-backend-app.up.railway.app`).

---

## 2. Frontend Deployment (Render or Vercel)

### Deploying to Vercel
1. Log in to **Vercel** and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In the project configuration:
   * **Framework Preset**: Select **Vite** or **Other**.
   * **Root Directory**: Select **`frontend`** (or click Edit and select the `frontend` folder).
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   * `VITE_API_URL`: The URL of your deployed Railway backend API (including `/api` suffix, e.g. `https://your-backend-app.up.railway.app/api`).
5. Click **Deploy**. Vercel will install dependencies and compile the assets.

### Deploying to Render
1. Sign up/log in to **Render.com**.
2. Click **New** -> **Static Site**.
3. Connect your GitHub repository.
4. Fill in the configuration:
   * **Name**: `github-profile-analyzer-ui`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
5. Expand **Advanced** -> **Environment Variables** and add:
   * `VITE_API_URL`: Your deployed Railway API URL (e.g., `https://your-backend-app.up.railway.app/api`).
6. Click **Create Static Site**.

> [!NOTE]
> We have pre-configured `@rollup/rollup-linux-x64-gnu` and `@rollup/rollup-linux-x64-musl` inside the `frontend/package.json` optional dependencies. This forces Render/Vercel (which run on Linux) to resolve and download the required native Rollup binaries even if the lockfile was generated on Windows. This completely prevents the `Cannot find module '@rollup/rollup-linux-x64-gnu'` compile crash.

---

## 3. Local Startup & Commands

### Clean Install
Run this command from the **root** folder to install all dependencies for both the backend and frontend at once using NPM workspaces:
```bash
npm install
```

### Run Backend Locally
Run this command from the **root** folder:
```bash
PORT=5000 npm run dev:backend
```
*Note: Make sure your local MySQL instance is running and configured inside `backend/.env`.*

### Run Frontend Locally
Run this command from the **root** folder:
```bash
npm run dev:frontend
```
The React frontend will be accessible at `http://localhost:3000`. It will proxy API requests to `http://localhost:5000/api` automatically.
