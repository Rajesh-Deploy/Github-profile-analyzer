const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { validateAnalyzeProfile, validateUsernameParam } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /profiles/analyze:
 *   post:
 *     summary: Analyze and store a GitHub user's profile
 *     description: Fetches profile data and public repositories from GitHub API, computes insights, and stores them in MySQL.
 *     parameters:
 *       - in: query
 *         name: refresh
 *         schema:
 *           type: boolean
 *         description: Force refresh data from GitHub API instead of returning cached data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The GitHub username
 *                 example: torvalds
 *     responses:
 *       200:
 *         description: Profile successfully analyzed/retrieved
 *       400:
 *         description: Validation error or invalid request
 *       404:
 *         description: GitHub user not found
 *       429:
 *         description: GitHub API rate limit exceeded
 */
router.post('/profiles/analyze', validateAnalyzeProfile, profileController.analyzeProfile);

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all analyzed profiles
 *     description: Retrieve all stored developer profiles with support for pagination, sorting, and username searches.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of profiles per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sorting order
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Query string to search for usernames (partial match)
 *     responses:
 *       200:
 *         description: List of profiles retrieved successfully
 */
router.get('/profiles', profileController.getProfiles);

/**
 * @swagger
 * /profiles/{username}:
 *   get:
 *     summary: Get profile by username
 *     description: Returns the full stored analysis for a specific user from the MySQL database.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The GitHub username to fetch from database
 *     responses:
 *       200:
 *         description: Profile data found and returned
 *       404:
 *         description: Profile not found in database
 */
router.get('/profiles/:username', validateUsernameParam, profileController.getProfileByUsername);

/**
 * @swagger
 * /profiles/{username}/reanalyze:
 *   put:
 *     summary: Reanalyze a GitHub user profile
 *     description: Fetches latest data from GitHub API and updates the existing local database entry.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The GitHub username to reanalyze
 *     responses:
 *       200:
 *         description: Profile reanalyzed and updated successfully
 *       404:
 *         description: Profile not found in database
 */
router.put('/profiles/:username/reanalyze', validateUsernameParam, profileController.reanalyzeProfile);

/**
 * @swagger
 * /profiles/{username}:
 *   delete:
 *     summary: Delete a profile
 *     description: Removes a profile's stored analysis from the local MySQL database.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The GitHub username to delete
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found in database
 */
router.delete('/profiles/:username', validateUsernameParam, profileController.deleteProfile);

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get profiles analytics
 *     description: Returns overall aggregate metrics, including total analyzed profiles, average followers, average stars, and top developer information.
 *     responses:
 *       200:
 *         description: Analytics summary retrieved successfully
 */
router.get('/analytics', profileController.getAnalytics);

/**
 * @swagger
 * /top-developers:
 *   get:
 *     summary: Get top 10 developers
 *     description: Returns the top 10 analyzed profiles sorted by developer score in descending order.
 *     responses:
 *       200:
 *         description: Top developers list retrieved successfully
 */
router.get('/top-developers', profileController.getTopDevelopers);

module.exports = router;
