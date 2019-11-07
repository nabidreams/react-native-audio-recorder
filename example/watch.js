const fs = require('fs');
const path = require('path');

const chokidar = require('chokidar');
const parse = require('parse-gitignore');

const libraryDir = path.join(__dirname, '..');

const { name: libraryName } = require(path.join(libraryDir, 'package.json'));
const targetDir = path.join(__dirname, 'node_modules', libraryName);

const watcher = chokidar.watch(libraryDir, {
  cwd: libraryDir,
  ignored: [
    /(^|[\/\\])\../,
    'node_modules',
    ...parse(fs.readFileSync(path.join(libraryDir, '.npmignore'))),
  ],
  ignoreInitial: true,
});

function getSourcePath(p) {
  return path.join(libraryDir, p);
}

function getTargetPath(p) {
  return path.join(targetDir, p);
}

watcher
  .on('ready', () => console.log('Initial scan complete. Ready for changes'))
  .on('error', (error) => console.error(`Watcher error: ${error}`))
  .on('add', (p) => {
    console.log(`File ${p} has been added`);
    fs.copyFileSync(getSourcePath(p), getTargetPath(p));
  })
  .on('change', (p) => {
    console.log(`File ${p} has been changed`);
    fs.copyFileSync(getSourcePath(p), getTargetPath(p));
  })
  .on('unlink', (p) => {
    console.log(`File ${p} has been removed`);
    fs.unlinkSync(getTargetPath(p));
  })
  .on('addDir', (p) => {
    console.log(`Directory ${p} has been added`);
    fs.mkdirSync(getTargetPath(p));
  })
  .on('unlinkDir', (p) => {
    console.log(`Directory ${p} has been removed`);
    fs.rmdirSync(getTargetPath(p));
  });
