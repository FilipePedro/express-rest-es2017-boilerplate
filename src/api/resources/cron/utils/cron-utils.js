const User = require('./../../users/models/User');

const testingGetUserCron = async () => {
  const user = await User.get('5c1be2f00109e044e1fc90a3');
  console.log('user: ', user);
};

const testingDeleteUserCron = async () => {
  await User.deleteMany({ deleted: true }, (err, rowsRemoved) => {
    const { n } = rowsRemoved;
    console.log('CRON REMOVED ROWS: ', n);
  });
};

module.exports = {
  testingGetUserCron,
  testingDeleteUserCron,
};
