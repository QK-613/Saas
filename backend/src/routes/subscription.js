const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/upgrade', subscriptionController.upgrade);
router.post('/manual-upgrade', subscriptionController.manualUpgrade);

module.exports = router;