const axios = require('axios');
const { calculateScore, determineTier } = require('../utils/scoreCalculator');
require('dotenv').config();

const GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || 'https://api.github.com';

/**
 * Returns common request headers for the GitHub API, including token if available.
 */
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Profile-Analyzer-API'
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handles axios errors and maps them to clean user-facing error objects.
 */
const handleAxiosError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';

    if (status === 404) {
      const customErr = new Error('GitHub user not found');
      customErr.statusCode = 404;
      throw customErr;
    }

    // Rate limits can return 403 (Forbidden) with rate limit headers, or 429 (Too Many Requests)
    const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
    if (status === 429 || (status === 403 && rateLimitRemaining === '0') || message.includes('rate limit exceeded')) {
      const customErr = new Error('GitHub API rate limit exceeded');
      customErr.statusCode = 429;
      throw customErr;
    }

    const customErr = new Error(message || 'Failed to fetch data from GitHub API');
    customErr.statusCode = status;
    throw customErr;
  }

  const networkErr = new Error('GitHub API service is currently unreachable');
  networkErr.statusCode = 503;
  throw networkErr;
};

/**
 * Fetch basic profile info for a GitHub user.
 */
const getUserProfile = async (username) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE_URL}/users/${username}`, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Fetch all public repositories for a GitHub user, handling pagination.
 */
const getUserRepos = async (username) => {
  let page = 1;
  let repos = [];
  let fetchMore = true;

  try {
    while (fetchMore) {
      const response = await axios.get(`${GITHUB_API_BASE_URL}/users/${username}/repos`, {
        headers: getHeaders(),
        params: {
          per_page: 100,
          page: page
        }
      });

      const pageRepos = response.data;
      if (!Array.isArray(pageRepos) || pageRepos.length === 0) {
        fetchMore = false;
      } else {
        repos = repos.concat(pageRepos);
        if (pageRepos.length < 100) {
          fetchMore = false;
        } else {
          page++;
        }
      }
    }
    return repos;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Analyzes a GitHub user's profile and returns a compiled insight object.
 */
const analyzeProfile = async (username) => {
  // 1. Fetch user data and repo data in parallel
  const [profileData, repos] = await Promise.all([
    getUserProfile(username),
    getUserRepos(username)
  ]);

  // 2. Perform Repository Analysis
  const total_repositories = repos.length;
  let total_stars_received = 0;
  let total_forks_received = 0;

  let most_starred_repo = null;
  let most_starred_repo_stars = 0;

  let most_forked_repo = null;
  let most_forked_repo_forks = 0;

  let latest_repo_created = null;
  let latest_repo_updated = null;

  const language_distribution = {};

  repos.forEach((repo) => {
    // Stars & Forks
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;

    total_stars_received += stars;
    total_forks_received += forks;

    if (stars >= most_starred_repo_stars) {
      most_starred_repo_stars = stars;
      most_starred_repo = repo.name;
    }

    if (forks >= most_forked_repo_forks) {
      most_forked_repo_forks = forks;
      most_forked_repo = repo.name;
    }

    // Languages distribution (primary language)
    const lang = repo.language;
    if (lang) {
      language_distribution[lang] = (language_distribution[lang] || 0) + 1;
    }

    // Dates
    const createdDate = repo.created_at ? new Date(repo.created_at) : null;
    const updatedDate = repo.updated_at ? new Date(repo.updated_at) : null;

    if (createdDate) {
      if (!latest_repo_created || createdDate > new Date(latest_repo_created)) {
        latest_repo_created = repo.created_at;
      }
    }

    if (updatedDate) {
      if (!latest_repo_updated || updatedDate > new Date(latest_repo_updated)) {
        latest_repo_updated = repo.updated_at;
      }
    }
  });

  // Calculate Averages
  const average_stars_per_repo = total_repositories > 0 
    ? parseFloat((total_stars_received / total_repositories).toFixed(2)) 
    : 0.00;

  const average_forks_per_repo = total_repositories > 0 
    ? parseFloat((total_forks_received / total_repositories).toFixed(2)) 
    : 0.00;

  // Determine Top Language
  let top_language = null;
  let maxLangCount = 0;
  Object.keys(language_distribution).forEach((lang) => {
    if (language_distribution[lang] > maxLangCount) {
      maxLangCount = language_distribution[lang];
      top_language = lang;
    }
  });

  // Calculate Developer Score & Tier
  const followers = profileData.followers || 0;
  const public_repos = profileData.public_repos || 0;
  const developer_score = calculateScore(followers, total_stars_received, public_repos);
  const tier = determineTier(developer_score);

  return {
    // Profile info
    github_id: profileData.id,
    username: profileData.login,
    name: profileData.name || null,
    bio: profileData.bio || null,
    company: profileData.company || null,
    location: profileData.location || null,
    blog: profileData.blog || null,
    avatar_url: profileData.avatar_url || null,
    profile_url: profileData.html_url || null,
    account_created_at: profileData.created_at,

    // Statistics
    public_repos: profileData.public_repos,
    followers: profileData.followers,
    following: profileData.following,
    public_gists: profileData.public_gists,

    // Repository Analysis
    total_repositories,
    total_stars_received,
    total_forks_received,
    average_stars_per_repo,
    average_forks_per_repo,
    most_starred_repo,
    most_starred_repo_stars,
    most_forked_repo,
    most_forked_repo_forks,

    // Language Analysis
    top_language,
    language_distribution,

    // Activity Analysis
    latest_repo_created,
    latest_repo_updated,

    // Classification
    developer_score,
    tier
  };
};

module.exports = {
  getUserProfile,
  getUserRepos,
  analyzeProfile
};
