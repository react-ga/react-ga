// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');

const mainPackage = require('./package.json');
const bower = require('./bower.json');

bower.version = mainPackage.version;

fs.writeJsonSync('./bower.json', bower, { spaces: 2 });
