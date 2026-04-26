const express = require('express');
const router = express.Router();
const copyController = require('../controllers/copyController');

router.post('/generate', copyController.generate);

module.exports = router;