const path = require('path');
const fg = require('fast-glob');

const configViews = (app) => {
  /* SET TEMPLATE ENGINE */
  app.set('view engine', 'pug');

  /* DYNAMIC VIEW SET */
  const entries = fg.sync('./../api/resources/**/views/', { onlyFiles: false, cwd: __dirname });
  const views = entries.map(e => path.join(__dirname, e));
  app.set('views', views);
};

module.exports = {
  configViews,
};
