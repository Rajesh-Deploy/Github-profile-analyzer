/**
 * Calculates a developer's score based on followers, stars, and repository count.
 * Formula: score = followers * 2 + total_stars_received * 3 + public_repos * 1
 * 
 * @param {number} followers - The number of followers
 * @param {number} totalStarsReceived - The total stars across public repositories
 * @param {number} publicRepos - The number of public repositories
 * @returns {number} The developer score
 */
const calculateScore = (followers = 0, totalStarsReceived = 0, publicRepos = 0) => {
  const score = (followers * 2) + (totalStarsReceived * 3) + (publicRepos * 1);
  return score;
};

/**
 * Determines the developer's profile tier based on their developer score.
 * Tiers:
 * - 0 to 100: Beginner
 * - 101 to 500: Intermediate
 * - 501 to 2000: Advanced
 * - 2000+: Expert
 * 
 * @param {number} score - The developer score
 * @returns {string} The developer tier string
 */
const determineTier = (score = 0) => {
  if (score <= 100) {
    return 'Beginner';
  } else if (score <= 500) {
    return 'Intermediate';
  } else if (score <= 2000) {
    return 'Advanced';
  } else {
    return 'Expert';
  }
};

module.exports = {
  calculateScore,
  determineTier
};
