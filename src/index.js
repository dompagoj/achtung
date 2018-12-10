const browserify = require('browserify')
const w = require('watchify')
const t = require('tsify')
const babel = require('babelify')
const fs = require('fs')

console.log(__dirname)

var bh1713913 = browserify()
  .add('src/main.ts')
  .plugin(t)
  .plugin(w, {
    ignoreWatch: ['']
  })
  .transform(babel);

  bh1713913.on('update', bundle);
  bundle();

  function bundle(){
    bh1713913.bundle()
    .pipe(fs.createWriteStream('bundle.js'))
  }
