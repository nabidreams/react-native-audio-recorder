const fs = require('fs');
const path = require('path');

const program = require('commander');
const parse = require('parse-gitignore');
const chalk = require('chalk');

const sourceDir = path.join(__dirname, '..');
const targetDir = path.join(
  __dirname,
  'node_modules',
  require(path.join(sourceDir, 'package.json')).name,
);

program.option('-w, --watch', 'watch source changes', false);
program.parse(process.argv);

function colorizeType(type) {
  const defaultChalk = chalk.bold;

  switch (type) {
    case 'add':
      return defaultChalk.yellow(type);
    case 'change':
      return defaultChalk.green(type);
    case 'unlink':
      return defaultChalk.red(type);
    case 'unlinkDir':
      return defaultChalk.magenta(type);
    default:
      return defaultChalk(type);
  }
}

require('sync-directory')(sourceDir, targetDir, {
  watch: program.watch,
  type: 'copy',
  exclude: [
    /(^|[\/\\])\../,
    'node_modules',
    ...parse(fs.readFileSync(path.join(sourceDir, '.npmignore'))),
  ],
  cb: ({ type, path: p }) =>
    console.log(colorizeType(type), chalk.dim(path.relative(sourceDir, p))),
});
