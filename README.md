# gulp-unic-handlebars

## Usage

First, install `gulp-unic-handlebars` as a development dependency:

```shell
npm install --save-dev gulp-unic-handlebars@git+https://git@github.com/unic/gulp-unic-handlebars.git
```

Then, add it to your `gulpfile.js` (probably together with [gulp-rename](https://www.npmjs.com/package/gulp-rename)):

```javascript
var handlebars = require('gulp-unic-handlebars'),
  rename = require('gulp-rename');

gulp.task('html', function(){
  gulp.src(['app/*.hbs'])
    .pipe(handlebars({
      data: function(file) {
        return require('./app/' + path.basename(file.path, '.hbs') + '.json');
      },
      partials: ['./app/partials/*.hbs'],
      getPartialName: function(filePath) {
          var extension = path.extname(filePath),
              name = path.relative('./app/partials/', filePath).replace(extension, '');

          return name.split(path.sep).join('/');
      }
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dest/'));
});
```


## Options

### options.data
Type: `Object|Function`

Data object to pass to the template or function taking the template's path as argument (see example above).

### options.partials
Type: `String|Array`

Glob or Array of globs.

#### options.getPartialName
Type: `Function`

Transformation function for partial names taking the partials path as argument (see example above).
