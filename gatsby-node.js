const fsExtra = require('fs-extra');

exports.onPostBuild = () => {

  fsExtra.copyFileSync(`${__dirname}/robots.txt`, `${__dirname}/public/robots.txt`, err => {
    if (err) {
      console.error('Error copying file', err);
    }
  });
};