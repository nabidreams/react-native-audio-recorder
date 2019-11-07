const fs = require('fs');
const path = require('path');

const parse = require('parse-gitignore');

const libraryDir = path.join(__dirname, '..');

const { name: libraryName } = require(path.join(libraryDir, 'package.json'));
const targetDir = path.join(__dirname, 'node_modules', libraryName);

require('sync-directory')(libraryDir, targetDir, {
  watch: true,
  type: 'copy',
  exclude: [
    /(^|[\/\\])\../,
    'node_modules',
    ...parse(fs.readFileSync(path.join(libraryDir, '.npmignore'))),
  ],
});
