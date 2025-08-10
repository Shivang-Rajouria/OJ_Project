const express = require('express');
const router = express.Router();
const { runSubmission } = require('../controllers/runController');

// Single route to handle both running custom input and submitting all test cases
router.post('/', runSubmission);

module.exports = router;
