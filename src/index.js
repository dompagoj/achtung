const b = require('browserify')
const w = require('watchify')
const t = require('tsify')
const fs = require('fs')

b()
  .add('src/main.ts')
  .plugin(t)
  .plugin(w, {
    ignoreWatch: ['**/node_modules/**'],
  })
  .bundle()
