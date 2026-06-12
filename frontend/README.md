# GitHub Profile Analyzer - React Frontend

A premium, responsive developer dashboard client built with React, Vite, Tailwind CSS, Recharts, Framer Motion, and Axios. It interfaces with the GitHub Profile Analyzer Backend API to visualize repository audits, programming language shares, system metrics, and leaderboard rankings.

---

## 🎨 Design Features

- **Modern Glassmorphic UI**: High-end translucent cards and dashboard pages utilizing backdrop filters.
- **Micro-Animations**: Custom hover transformations, list layouts, and load indicators using Framer Motion.
- **Top Developers Podium**: Gold, Silver, and Bronze tier visual podium highlighting top 3 rankings.
- **Platform Analytics**: Interactive Area and Bar charts displaying followers, scores, and programming language distributions via Recharts.
- **Clean Form Validations**: Input field validations following exact GitHub username guidelines.
- **Global Toast Alerts**: Instant action notices (success, errors, updates) managed through `react-hot-toast`.
- **Global State Context**: Standard State Management with React Context API separating concerns from individual views.

---

## 🛠️ Technology Stack

- **Framework & Build**: React (v18) + Vite (v5)
- **Styling**: Tailwind CSS (v3) + PostCSS
- **Routing**: React Router DOM (v6)
- **HTTP client**: Axios
- **Charts Engine**: Recharts
- **Alert System**: React Hot Toast
- **Animations Engine**: Framer Motion

---

## ⚙️ Environment Variables

Create a `.env` configuration file in the project root:

```env
# URL pointing to the running backend service APIs
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Setup

### 1. Download Dependencies
Ensure you are inside the frontend project directory:
```bash
cd github-profile-analyzer-frontend
npm install
```

### 2. Configure Environment
Copy the example variables file:
```bash
cp .env.example .env
```
Ensure the `VITE_API_URL` variable correctly references your running backend instance.

---

## 🏃 Running the Application

### Launch Local Development Server (Hot-reload)
```bash
npm run dev
```
The client dashboard should launch automatically. By default, it runs on:
👉 **[http://localhost:3000](http://localhost:3000)**

### Build for Production
This will optimize, build, and compile the static bundle into a `dist/` directory:
```bash
npm run build
```

### Preview Production Build
Locally preview your production build folder:
```bash
npm run preview
```

---

## ☁️ Deployment Instructions

### Deploying to Vercel

#### Method 1: Vercel Dashboard (Recommended)
1. Sign up on **[Vercel.com](https://vercel.com/)**.
2. Connect your GitHub repository.
3. Choose the `github-profile-analyzer-frontend` directory as the project root.
4. Set Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Configure Environment Variables:
   - Set key `VITE_API_URL` to your production backend URL (e.g. `https://your-backend.render.com/api`).
6. Click **Deploy**.

#### Method 2: Vercel CLI
Execute the deploy script after installing Vercel globally:
```bash
npm install -g vercel
vercel
```

---

### Deploying to Netlify

#### Method 1: Netlify Dashboard
1. Sign up on **[Netlify.com](https://netlify.com/)**.
2. Select **Add new site** -> **Import an existing project** and connect your GitHub repository.
3. Specify Build Settings:
   - **Base directory**: `github-profile-analyzer-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `github-profile-analyzer-frontend/dist`
4. Expand **Environment Variables** and add `VITE_API_URL`.
5. Click **Deploy site**.

#### Method 2: Configure netlify.toml (Optional)
To support React Router single-page redirects, you may add a `public/_redirects` file or a `netlify.toml` in your static assets:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
This is already configured to work dynamically in Vercel/Netlify.
