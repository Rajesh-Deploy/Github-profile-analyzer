const { Op } = require('sequelize');
const Profile = require('../models/profile.model');
const githubService = require('../services/github.service');

/**
 * POST /api/profiles/analyze
 * Body: { username }
 * Query: ?refresh=true (optional)
 * Analyzes and stores a github profile.
 */
const analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    const refresh = req.query.refresh === 'true';

    // 1. If refresh is not requested, check database cache
    if (!refresh) {
      const existingProfile = await Profile.findOne({
        where: { username: { [Op.like]: username } } // case-insensitive username comparison
      });

      if (existingProfile) {
        return res.status(200).json({
          success: true,
          message: 'Profile retrieved from cache',
          data: existingProfile
        });
      }
    }

    // 2. Otherwise, fetch and compile insights from GitHub
    console.log(`Analyzing GitHub profile for user: ${username}...`);
    const insights = await githubService.analyzeProfile(username);

    // 3. Save or update the record in MySQL database
    // We search by github_id (or username) and upsert/update
    const [profile, created] = await Profile.upsert(insights, {
      returning: true
    });

    // Note: upsert in Sequelize returns [instance, created] (created is boolean or null)
    // However, some dialects do not return the instance. So we'll query it if not returned.
    const savedProfile = profile || await Profile.findOne({ where: { github_id: insights.github_id } });

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Profile analyzed and saved successfully' : 'Profile updated successfully',
      data: savedProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profiles
 * Query: page, limit, sortBy, order, username
 * Retrieves profiles list with filters, sorting, and pagination.
 */
const getProfiles = async (req, res, next) => {
  try {
    // Parse query params
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const sortBy = req.query.sortBy || 'created_at';
    const order = req.query.order || 'DESC';
    const searchUsername = req.query.username;

    // Validate parameters
    const offset = (page - 1) * limit;
    const orderDirection = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    
    // Whitelist allowed sort fields to prevent SQL injection
    const allowedSortFields = [
      'id', 'github_id', 'username', 'name', 'public_repos', 'followers', 
      'following', 'public_gists', 'total_repositories', 'total_stars_received', 
      'total_forks_received', 'average_stars_per_repo', 'average_forks_per_repo', 
      'developer_score', 'tier', 'created_at', 'updated_at'
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';

    // Construct query condition
    const whereCondition = {};
    if (searchUsername) {
      whereCondition.username = {
        [Op.like]: `%${searchUsername}%`
      };
    }

    // Execute paginated search
    const { count, rows } = await Profile.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [[sortField, orderDirection]]
    });

    return res.status(200).json({
      success: true,
      data: {
        profiles: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profiles/:username
 * Retrieves a single profile from database.
 */
const getProfileByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const profile = await Profile.findOne({
      where: { username: { [Op.like]: username } }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found in database'
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profiles/:username/reanalyze
 * Triggers re-fetching from GitHub API and updates the local db record.
 */
const reanalyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Check if profile is tracked in database
    const existingProfile = await Profile.findOne({
      where: { username: { [Op.like]: username } }
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile does not exist in local database. Use POST /api/profiles/analyze instead.'
      });
    }

    console.log(`Reanalyzing GitHub profile for user: ${username}...`);
    const insights = await githubService.analyzeProfile(username);

    // Update the existing profile record
    await existingProfile.update(insights);

    return res.status(200).json({
      success: true,
      message: 'Profile reanalyzed successfully',
      data: existingProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/profiles/:username
 * Removes a profile record from local database.
 */
const deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const deletedCount = await Profile.destroy({
      where: { username: { [Op.like]: username } }
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found in database'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics
 * Returns summary stats across all profiles.
 */
const getAnalytics = async (req, res, next) => {
  try {
    const totalProfiles = await Profile.count();

    if (totalProfiles === 0) {
      return res.status(200).json({
        totalProfiles: 0,
        averageFollowers: 0,
        averageStars: 0,
        topDeveloper: {}
      });
    }

    const averageFollowers = await Profile.sum('followers') / totalProfiles;
    const averageStars = await Profile.sum('total_stars_received') / totalProfiles;
    
    const topDeveloper = await Profile.findOne({
      order: [['developer_score', 'DESC']]
    });

    return res.status(200).json({
      totalProfiles,
      averageFollowers: Math.round(averageFollowers * 100) / 100,
      averageStars: Math.round(averageStars * 100) / 100,
      topDeveloper: topDeveloper || {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/top-developers
 * Returns top 10 profiles ordered by developer score.
 */
const getTopDevelopers = async (req, res, next) => {
  try {
    const topDevs = await Profile.findAll({
      order: [['developer_score', 'DESC']],
      limit: 10
    });

    return res.status(200).json({
      success: true,
      data: topDevs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeProfile,
  getProfiles,
  getProfileByUsername,
  reanalyzeProfile,
  deleteProfile,
  getAnalytics,
  getTopDevelopers
};
