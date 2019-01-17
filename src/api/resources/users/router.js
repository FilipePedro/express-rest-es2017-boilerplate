const { Router } = require('express');
const validate = require('express-validation');

const {
  list,
  load,
  get,
  create,
  replace,
  update,
  remove,
} = require('./controllers/users.controller');

const {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
  validateUserID,
} = require('./validations/user.validations');

const router = Router();
/**
 * Load user when API with userId route parameter is hit
 */

router
  .route('/')
  .get(validate(listUsers), list)
  .post(validate(createUser), create);

router
  .route('/:userId')
  .get(get)
  .put(validate(replaceUser), replace)
  .patch(validate(updateUser), update)
  .delete(remove);


// validate and load user by userId
router.param('userId', validate(validateUserID));
router.param('userId', load);

module.exports = router;
