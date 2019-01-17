const User = require('./../../resources/users/models/User');

const testingGetUserCron = async (next) => {
  try {
    const user = await User.get('5c1be2f00109e044e1fc90a3');
    console.log('user: ', user);
  } catch (err) {
    console.log('testingGetUserCron err: ', err.message);
  }
};

const testingDeleteUserCron = async () => {
  try {
    await User.deleteMany({ deleted: true }, (err, rowsRemoved) => {
      // const { n } = rowsRemoved;
      console.log('CRON REMOVED ROWS: ', rowsRemoved);
    });
  } catch (err) {
    console.log('testingDeleteUserCron err: ', err.message);
  }
};

module.exports = {
  testingGetUserCron,
  testingDeleteUserCron,
};
