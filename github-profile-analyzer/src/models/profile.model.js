const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  github_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING(39),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  blog: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  profile_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  account_created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  public_repos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  public_gists: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_repositories: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_stars_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_forks_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  average_stars_per_repo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  average_forks_per_repo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  most_starred_repo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  most_starred_repo_stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  most_forked_repo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  most_forked_repo_forks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  top_language: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  language_distribution: {
    type: DataTypes.JSON,
    allowNull: true
  },
  latest_repo_created: {
    type: DataTypes.DATE,
    allowNull: true
  },
  latest_repo_updated: {
    type: DataTypes.DATE,
    allowNull: true
  },
  developer_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tier: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'profiles',
  tableNameUnderscored: true
});

module.exports = Profile;
