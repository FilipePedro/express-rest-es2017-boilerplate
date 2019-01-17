/* test specific modules */
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
/* generic modules */
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { some, omitBy, isNil } = require('lodash');
const { version } = require('./../../../config/vars');
/* required model */
const User = require('./../../resources/users/models/User');
/* require faker data */
const { fakerUserData } = require('./../../utils/faker');
/* main index */
const app = require('./../../../index');

/**
 * root level hooks
 */
const _wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const format = async (user) => {
  // get users from database
  const dbUser = (await User.findOne({ email: user.email })).transform();
  // remove null and undefined properties
  return omitBy({ ...dbUser, _id: dbUser._id.toString() }, isNil);
};

describe('Users API', async () => {
  let dbUsers;

  beforeEach(async () => {
    const password = '123456';
    const passwordHashed = await bcrypt.hash(password, 1);

    dbUsers = {
      branStark: {
        email: 'branstark@gmail.com',
        password: passwordHashed,
        name: 'Bran Stark',
        role: 'admin',
      },
      jonSnow: {
        email: 'jonsnow@gmail.com',
        password: passwordHashed,
        name: 'Jon Snow',
      },
    };
    await User.deleteMany({ email: { $in: ['branstark@gmail.com', 'jonsnow@gmail.com'] } });
    // await User.insertMany([dbUsers.branStark, dbUsers.jonSnow]);
    await User.create(dbUsers.jonSnow);
    await _wait(100);
    await User.create(dbUsers.branStark);
  });

  describe(`GET /v${version}/users`, async () => {
    it('should list users when request is ok', async () => {
      const usersLength = await User.countDocuments().lean();
      const { body: { status, data } } = await request(app)
        .get(`/v${version}/users`)
        .expect(httpStatus.OK);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('users');
      expect(data.users).to.be.a('array');
      expect(data.users).to.have.lengthOf(usersLength);
    });

    it('should get all users with pagination', async () => {
      const usersLength = await User.countDocuments().lean();
      const q = { page: 2, perPage: 1 };
      const { body: { status, data } } = await request(app)
        .get(`/v${version}/users`)
        .query(q)
        .expect(httpStatus.OK);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions

      const jon = await format(dbUsers.jonSnow);
      const includesJonSnow = some(data.users, jon);

      expect(data.users).to.be.an('array');
      expect(data.users).to.have.lengthOf(usersLength - q.perPage);
      expect(includesJonSnow).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should report error when pagination\'s parameters are not a number', async () => {
      const q = { page: '?', perPage: 'nothing' };
      const { body: { errors } } = await request(app)
        .get(`/v${version}/users`)
        .query(q)
        .expect(httpStatus.BAD_REQUEST);

      const {
        field: fieldPage,
        location: locationPage,
        messages: messagesPage,
      } = errors[0];

      const {
        field: fieldPerPage,
        location: locationPerPage,
        messages: messagesPerPage,
      } = errors[1];

      // page parameter test
      expect(fieldPage).to.include('page');
      expect(locationPage).to.be.equal('query');
      expect(messagesPage).to.include('"page" must be a number');

      // perPage parameter test
      expect(fieldPerPage).to.include('perPage');
      expect(locationPerPage).to.be.equal('query');
      expect(messagesPerPage).to.include('"perPage" must be a number');
    });
  });

  describe(`POST /v${version}/users`, async () => {
    it('should create a new user when request is ok', async () => {
      const fakeUser = fakerUserData();
      const { body: { status, data } } = await request(app)
        .post(`/v${version}/users`)
        .send(fakeUser)
        .expect(httpStatus.CREATED);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('user');
      expect(data.user).to.have.property('_id');
      expect(data.user).to.have.property('name').to.be.equal(fakeUser.name);
      // remove user after test
      await User.deleteOne({ _id: data.user._id });
    });

    it('should create a new user and set default role to "user"', async () => {
      const { role, ...noRoleUser } = fakerUserData(); // eslint-disable-line no-unused-vars
      const { body: { status, data } } = await request(app)
        .post(`/v${version}/users`)
        .send(noRoleUser)
        .expect(httpStatus.CREATED);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('user');
      expect(data.user.role).to.be.equal('user');
      // remove user after test
      await User.deleteOne({ _id: data.user._id });
    });

    it('should report error when email is not provided', async () => {
      const { email, ...noEmailUser } = fakerUserData(); // eslint-disable-line no-unused-vars
      const { body: { errors } } = await request(app)
        .post(`/v${version}/users`)
        .send(noEmailUser)
        .expect(httpStatus.BAD_REQUEST);
      const { field, location, messages } = errors[0];
      expect(field).to.include('email');
      expect(location).to.be.equal('body');
      expect(messages).to.include('"email" is required');
    });


    it('should report error when email already exists', async () => {
      const fakeUser = { ...fakerUserData(), email: dbUsers.jonSnow.email };
      const { body: { errors } } = await request(app)
        .post(`/v${version}/users`)
        .send(fakeUser)
        .expect(httpStatus.CONFLICT);
      const { field, location, messages } = errors[0];
      expect(field).to.include('email');
      expect(location).to.be.equal('body');
      expect(messages).to.include('"email" already exists');
    });

    it('should report error when password length is less than 6', async () => {
      const fakeUser = { ...fakerUserData(), password: '12345' };
      const { body: { errors } } = await request(app)
        .post(`/v${version}/users`)
        .send(fakeUser)
        .expect(httpStatus.BAD_REQUEST);
      const { field, location, messages } = errors[0];
      expect(field).to.include('password');
      expect(location).to.be.equal('body');
      expect(messages).to.include('"password" length must be at least 6 characters long');
    });
  });

  describe(`GET /v${version}/users/:userId`, async () => {
    it('should get user', async () => {
      const id = (await User.findOne({}))._id;
      const { body: { status, data } } = await request(app)
        .get(`/v${version}/users/${id}`)
        .expect(httpStatus.OK);

      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('user');
      // password wont come in response
      delete dbUsers.jonSnow.password;
      expect(data.user).to.include(dbUsers.jonSnow);
    });

    it('should report error "User does not exist" when user does not exists', async () => {
      const { body: { message, code } } = await request(app)
        .get(`/v${version}/users/56c787ccc67fc16ccc1a5e92`)
        .expect(httpStatus.NOT_FOUND);
      expect(code).to.be.equal(404);
      expect(message).to.be.equal('User does not exist');
    });

    it('should report error "User does not exist" when id is not a valid ObjectID', async () => {
      const { body: { code, errors } } = await request(app)
        .get(`/v${version}/users/sporting1987`)
        .expect(httpStatus.BAD_REQUEST);

      expect(code).to.be.equal(400);
      const { field, location, types } = errors[0];
      expect(field).to.include('userId');
      expect(location).to.be.equal('params');
      expect(types).to.include('string.regex.base');
    });
  });

  describe(`PUT /v${version}/users/:userId`, async () => {
    it('should replace user', async () => {
      const id = (await User.findOne(dbUsers.jonSnow))._id;
      let fakeUser = fakerUserData();

      const { body: { status, data } } = await request(app)
        .put(`/v${version}/users/${id}`)
        .send(fakeUser)
        .expect(httpStatus.OK);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('user');

      // remove fakeUserpassword
      delete fakeUser.password;
      fakeUser = { ...fakeUser, email: fakeUser.email.toLowerCase() };
      // remove _id from returned user
      delete data.user._id;
      expect(data.user).to.include(fakeUser);

      await User.deleteOne({ name: fakeUser.name });
    });

    it('should report error when email is not provided', async () => {
      const id = (await User.findOne({}))._id;
      const fakeUser = fakerUserData();
      delete fakeUser.email;

      const { body: { errors } } = await request(app)
        .put(`/v${version}/users/${id}`)
        .send(fakeUser)
        .expect(httpStatus.BAD_REQUEST);
      const { field, location, messages } = errors[0];
      expect(field).to.include('email');
      expect(location).to.be.equal('body');
      expect(messages).to.include('"email" is required');
    });

    it('should report error "User does not exist" when user does not exists', async () => {
      const { body: { message, code } } = await request(app)
        .put(`/v${version}/users/56c787ccc67fc16ccc1a5e92`)
        .expect(httpStatus.NOT_FOUND);
      expect(code).to.be.equal(404);
      expect(message).to.be.equal('User does not exist');
    });
  });

  describe(`PATCH /v${version}/users/:userId`, async () => {
    it('should update user', async () => {
      const id = (await User.findOne(dbUsers.jonSnow))._id;
      const { name } = fakerUserData();

      const { body: { status, data } } = await request(app)
        .patch(`/v${version}/users/${id}`)
        .send({ name })
        .expect(httpStatus.OK);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('user');
      expect(data.user.name).to.be.equal(name);
      expect(data.user.email).to.be.equal(dbUsers.jonSnow.email);
      await User.deleteOne({ name });
    });

    it('should not update user when no parameters were given', async () => {
      const id = (await User.findOne(dbUsers.jonSnow))._id;
      const { body: { status, data } } = await request(app)
        .patch(`/v${version}/users/${id}`)
        .send()
        .expect(httpStatus.OK);
      expect(status).to.be.true; // eslint-disable-line no-unused-expressions
      expect(data).to.have.property('user');
      delete dbUsers.jonSnow.password;
      expect(data.user).to.include(dbUsers.jonSnow);
    });

    it('should report error "User does not exist" when user does not exists', async () => {
      const { body: { message, code } } = await request(app)
        .patch(`/v${version}/users/56c787ccc67fc16ccc1a5e92`)
        .expect(httpStatus.NOT_FOUND);
      expect(code).to.be.equal(404);
      expect(message).to.be.equal('User does not exist');
    });
  });

  describe(`DELETE /v${version}/users/:userId`, async () => {
    it('should delete user', async () => {
      const id = (await User.findOne(dbUsers.jonSnow))._id;
      await request(app)
        .delete(`/v${version}/users/${id}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const { body: { message, code } } = await request(app)
        .get(`/v${version}/users/${id}`)
        .expect(httpStatus.NOT_FOUND);
      expect(code).to.be.equal(404);
      expect(message).to.be.equal('User does not exist');
    });

    it('should report error "User does not exist" when user does not exists', async () => {
      const { body: { message, code } } = await request(app)
        .delete(`/v${version}/users/56c787ccc67fc16ccc1a5e92`)
        .expect(httpStatus.NOT_FOUND);
      expect(code).to.be.equal(404);
      expect(message).to.be.equal('User does not exist');
    });
  });
});
