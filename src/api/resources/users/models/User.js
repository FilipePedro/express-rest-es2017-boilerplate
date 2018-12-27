const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('./../../../utils/APIError');

const { Schema } = mongoose;

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
 * User Schema
 * @private
 */
const userSchema = new Schema({
  name: String,
},
{
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async (next) => {});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'name'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

userSchema.statics = {
  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) user = await this.findById(id).exec();
      // console.log('USER: ', user);
      if (user) return user;

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (err) {
      throw err;
    }
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, name, email, role,
  }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

userSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports = mongoose.model('User', userSchema);
