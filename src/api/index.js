const { Router } = require('express');

const router = Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => res.send('OK'));

module.exports = router;
