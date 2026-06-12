# GitHub Profile Analyzer API

A production-ready Node.js backend service that analyzes a GitHub user's public profile and repositories using the GitHub API, computes metrics, assigns developer tiers, caches insights in a MySQL database, and exposes REST API endpoints with auto-generated Swagger documentation.

---

## 🚀 Features

- **Profile & Repository Sync**: Fetches user statistics and public repository logs from the GitHub REST API.
- **Repository Analytics**:
  - Accumulates total repository stars and forks count.
  - Computes averages for stars and forks per repository.
  - Pinpoints the user's most starred and most forked repository titles.
- **Language Distributions**: Aggregates primary programming languages to generate a percentage/frequency distribution index.
- **Activity Tracker**: Extracts timestamps for the user's latest created and latest updated public repositories.
- **Developer Scoring & Tiering**:
  - Calculates a custom score: `score = (followers * 2) + (total_stars_received * 3) + (public_repos * 1)`
  - Classifies profile tiers:
    - **0 - 100**: Beginner
    - **101 - 500**: Intermediate
    - **501 - 2000**: Advanced
    - **2000+**: Expert
- **Smart Caching**: Local caching of analyzed profiles to prevent API rate-limit depletion, with a query parameter `?refresh=true` to force update.
- **Advanced Query Filters**: Supports offset pagination, multi-column sorting, and partial username queries.
- **Aggregations & Leaderboard**: Dedicated endpoints for system-wide statistics (average followers, average stars, top developers) and a scoreboard (Top 10 developers).
- **Security & Logging**: Integrates `helmet` headers protection, `cors` cross-origin control, validation schemas via `express-validator`, and logger streams via `morgan`.
- **Interactive OpenAPI Documentation**: Built-in Swagger Docs rendered at `/api/docs`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v4)
- **Database ORM**: Sequelize (v6) with MySQL Dialect
- **HTTP Client**: Axios
- **Documentation**: Swagger UI & Swagger JSDoc
- **Security**: Helmet, CORS, Express-Validator
- **Logging**: Morgan

---

## 📁 Project Directory Structure

```text
github-profile-analyzer/
├── database/
│   └── schema.sql
├── postman/
│   └── GitHubProfileAnalyzer.postman_collection.json
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── profile.controller.js
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   └── profile.model.js
│   ├── routes/
│   │   └── profile.routes.js
│   ├── services/
│   │   └── github.service.js
│   ├── utils/
│   │   └── scoreCalculator.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP Server listening port | `5000` |
| `NODE_ENV` | Running environment (`development` / `production`) | `development` |
| `DB_HOST` | MySQL hostname | `localhost` |
| `DB_PORT` | MySQL database port | `3306` |
| `DB_NAME` | MySQL database name | `github_profile_analyzer` |
| `DB_USER` | Database access username | `root` |
| `DB_PASSWORD` | Database access password | `password` |
| `GITHUB_API_BASE_URL`| Target GitHub endpoint url | `https://api.github.com`|
| `GITHUB_TOKEN` | Optional GitHub Personal Access Token (Highly Recommended) | *(blank)* |

> [!NOTE]
> Setting up a `GITHUB_TOKEN` is highly recommended to increase GitHub's API rate limits from **60 requests/hour** (unauthenticated) to **5,000 requests/hour** (authenticated).

---

## ⚙️ Installation & Database Setup

### 1. Clone & Dependencies
Install dependencies after navigating into the folder:
```bash
cd github-profile-analyzer
npm install
```

### 2. Database Creation
Create your MySQL database. You can execute the SQL queries from `database/schema.sql`:
```bash
mysql -u root -p < database/schema.sql
```
Alternatively, Sequelize will automatically synchronize and build the `profiles` table schema when the application boots up!

---

## 🏃 Running the Project

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once running, access the interactive API Swagger docs at:
👉 **[http://localhost:5000/api/docs](http://localhost:5000/api/docs)**

---

## 🔌 API Endpoints

### 1. Analyze Profile
- **POST** `/api/profiles/analyze`
- **Request Body**:
  ```json
  {
    "username": "torvalds"
  }
  ```
- **Query Params**: `?refresh=true` (Optional: bypasses local database cache and re-queries GitHub API).

### 2. Get All Profiles (with pagination/sorting/searching)
- **GET** `/api/profiles`
- **Query Params**:
  - `?page=1` (Default: `1`)
  - `?limit=10` (Default: `10`)
  - `?sortBy=developer_score` (Default: `created_at`)
  - `?order=DESC` (Default: `DESC` or `ASC`)
  - `?username=tor` (Optional: partial username wildcard search)

### 3. Get Single Profile
- **GET** `/api/profiles/:username`
- Returns full stored metrics.

### 4. Reanalyze Profile
- **PUT** `/api/profiles/:username/reanalyze`
- Fetches the latest statistics from the GitHub REST API and updates the local database.

### 5. Delete Profile
- **DELETE** `/api/profiles/:username`
- Removes the user's metrics from the database.

### 6. Analytics Overview
- **GET** `/api/analytics`
- Returns aggregate metrics (Total Profiles, Average Followers, Average Stars, Top Developer).

### 7. Leaderboard (Top Developers)
- **GET** `/api/top-developers`
- Returns the top 10 profiles sorted by `developer_score` descending.

---

## 📡 Sample Responses

### Analyze Profile (`POST /api/profiles/analyze`)
```json
{
  "success": true,
  "message": "Profile analyzed and saved successfully",
  "data": {
    "id": 1,
    "github_id": 102422,
    "username": "torvalds",
    "name": "Linus Torvalds",
    "bio": "The creator of Linux and Git.",
    "company": "Linux Foundation",
    "location": "Portland, OR",
    "blog": "http://example.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/102422?v=4",
    "profile_url": "https://github.com/torvalds",
    "account_created_at": "2011-09-03T15:25:07.000Z",
    "public_repos": 6,
    "followers": 210000,
    "following": 0,
    "public_gists": 0,
    "total_repositories": 6,
    "total_stars_received": 185000,
    "total_forks_received": 35000,
    "average_stars_per_repo": 30833.33,
    "average_forks_per_repo": 5833.33,
    "most_starred_repo": "linux",
    "most_starred_repo_stars": 160000,
    "most_forked_repo": "linux",
    "most_forked_repo_forks": 30000,
    "top_language": "C",
    "language_distribution": {
      "C": 4,
      "Shell": 2
    },
    "latest_repo_created": "2011-09-04T22:30:00.000Z",
    "latest_repo_updated": "2026-06-10T12:00:00.000Z",
    "developer_score": 975006,
    "tier": "Expert",
    "created_at": "2026-06-11T11:00:00.000Z",
    "updated_at": "2026-06-11T11:00:00.000Z"
  }
}
```

### Analytics (`GET /api/analytics`)
```json
{
  "totalProfiles": 12,
  "averageFollowers": 17500.5,
  "averageStars": 15400.25,
  "topDeveloper": {
    "id": 1,
    "username": "torvalds",
    "developer_score": 975006,
    "tier": "Expert"
  }
}
```

---

## ☁️ Deployment Guide

### Deploying to Render
1. Sign up on **[Render.com](https://render.com/)**.
2. Provision a **Render MySQL Database**. Copy the internal/external Database Connection URI.
3. Select **New Web Service** and link your GitHub repository.
4. Fill in environment variables matching the copy in your `.env` settings (excluding database local variables; bind them to the Render DB host, username, and password).
5. Specify the Build Command: `npm install`
6. Specify the Start Command: `npm start`
7. Deploy.

### Deploying to Railway
1. Sign up on **[Railway.app](https://railway.app/)**.
2. Click **New Project** and select **Provision MySQL**.
3. Railway automatically sets up configuration credentials.
4. Click **New Service** -> **GitHub Repo** and connect your repository.
5. Railway automatically reads configuration details or binds environmental parameters (`PORT`, etc.). Copy the Database credentials from the MySQL service variables tab to your service variables list.
6. Railway detects `package.json` and launches the application automatically!

---

## 🔒 Security Best Practices Implemented

1. **SQL Injection Prevention**: All inputs processed via routes and database transactions are secured using Sequelize ORM queries which internally use parameterized statements.
2. **Secure HTTP Headers**: Enabled using the `helmet` middleware.
3. **CORS Control**: Access rules controlled using the `cors` package.
4. **Environment Separation**: Sensitive credentials are never hardcoded and are loaded dynamically using `dotenv`.
5. **Input Validation**: Express routes validate fields using `express-validator` to block malicious requests before hitting controllers.
