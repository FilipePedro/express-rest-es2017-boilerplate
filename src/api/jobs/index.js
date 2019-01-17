const { cronTask } = require('./config');

const {
  testingGetUserCron,
  testingDeleteUserCron,
} = require('./utils/cron-utils');


const testingCron = async (schedule) => {
  console.log('testingCron STARTED!!');
  cronTask(() => {
    console.log('running a task every minute');
  }, schedule).start();
};

const testingGetUserCronById = async (schedule) => {
  console.log('testingGetUserCronById STARTED!!');
  cronTask(testingGetUserCron, schedule).start();
};

const testingDeleteUsersCron = async (schedule) => {
  console.log('testingDeleteUsersCron STARTED!!');
  cronTask(testingDeleteUserCron, schedule).start();
};

module.exports = {
  testingCron,
  testingGetUserCronById,
  testingDeleteUsersCron,
};
