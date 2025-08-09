const express = require('express');
const router = express.Router();
const { runSubmission } = require('../controllers/runController');

router.post('/', runSubmission);

module.exports = router;
