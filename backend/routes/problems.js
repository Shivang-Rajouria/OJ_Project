const express = require('express');
const router = express.Router();
const { listProblems, getProblem } = require('../controllers/problemsController');

router.get('/', listProblems);
router.get('/:id', getProblem);

module.exports = router;
