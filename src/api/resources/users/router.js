const { Router } = require('express');

const {
  init,
  load,
  get,
} = require('./controllers/users.controller');

const router = Router();
/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', load);

router
  .route('/')
  .get(init);

router
  .route('/:userId')
  .get(get);

module.exports = router;
