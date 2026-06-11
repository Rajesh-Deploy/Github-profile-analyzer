-- Create Database
CREATE DATABASE IF NOT EXISTS github_profile_analyzer;
USE github_profile_analyzer;

-- Create Table: profiles
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    github_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(39) NOT NULL UNIQUE,
    name VARCHAR(255),
    bio TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    blog VARCHAR(255),
    avatar_url VARCHAR(255),
    profile_url VARCHAR(255),
    account_created_at DATETIME,
    
    -- GitHub Statistics
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    public_gists INT DEFAULT 0,
    
    -- Repository Analysis
    total_repositories INT DEFAULT 0,
    total_stars_received INT DEFAULT 0,
    total_forks_received INT DEFAULT 0,
    average_stars_per_repo DECIMAL(10, 2) DEFAULT 0.00,
    average_forks_per_repo DECIMAL(10, 2) DEFAULT 0.00,
    most_starred_repo VARCHAR(255),
    most_starred_repo_stars INT DEFAULT 0,
    most_forked_repo VARCHAR(255),
    most_forked_repo_forks INT DEFAULT 0,
    
    -- Language Analysis
    top_language VARCHAR(100),
    language_distribution JSON,
    
    -- Activity Analysis
    latest_repo_created DATETIME,
    latest_repo_updated DATETIME,
    
    -- Custom Score & Classification
    developer_score INT DEFAULT 0,
    tier VARCHAR(50) NOT NULL,
    
    -- Sequelize Timestamps
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
