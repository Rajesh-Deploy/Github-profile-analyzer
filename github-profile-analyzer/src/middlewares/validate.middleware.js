const { body, param, validationResult } = require('express-validator');

/**
 * Common middleware that checks for validation errors in express-validator.
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rule for analyzing a profile.
 */
const validateAnalyzeProfile = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 1, max: 39 })
    .withMessage('Username must be between 1 and 39 characters')
    // GitHub username rules: alphanumeric and hyphen, cannot start/end with hyphen, no consecutive hyphens
    .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .withMessage('Invalid GitHub username format'),
  validateResults
];

/**
 * Validation rule for operations specifying a username parameter.
 */
const validateUsernameParam = [
  param('username')
    .trim()
    .notEmpty()
    .withMessage('Username parameter is required')
    .isLength({ min: 1, max: 39 })
    .withMessage('Username must be between 1 and 39 characters')
    .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .withMessage('Invalid GitHub username format'),
  validateResults
];

module.exports = {
  validateAnalyzeProfile,
  validateUsernameParam
};
