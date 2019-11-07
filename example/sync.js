const fs = require('fs');
const path = require('path');

const program = require('commander');
const parse = require('parse-gitignore');

const sourceDir = path.join(__dirname, '..');
const targetDir = path.join(
  __dirname,
  'node_modules',
  require(path.join(sourceDir, 'package.json')).name,
);

program.option('-w, --watch', 'watch source changes', false);
program.parse(process.argv);

require('sync-directory')(sourceDir, targetDir, {
  watch: program.watch,
  type: 'copy',
  exclude: [
    /(^|[\/\\])\../,
    'node_modules',
    ...parse(fs.readFileSync(path.join(sourceDir, '.npmignore'))),
  ],
});
