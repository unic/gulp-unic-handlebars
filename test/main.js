var gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	es = require('event-stream'),
	assert = require('assert'),
	handlebars = require('../index.js'),
	rename = require('gulp-rename');

describe('gulp-unic-handlebars', function() {
	it('should generate the correct markup', function(done) {
		gulp.src(__dirname + '/fixtures/index.hbs')
			.pipe(handlebars({
				data: function(file) {
					return require('./fixtures/' + path.basename(file.path, '.hbs') + '.json');
				},
				partials: ['./test/fixtures/_*.hbs'],
				getPartialName: function(filePath) {
					var extension = path.extname(filePath),
						name = path.relative('./test/fixtures/', filePath).replace(extension, '');

					return name.split(path.sep).join('/');
				}
			}))
			.pipe(rename({
				extname: '.html'
			}))
			.pipe(gulp.dest(__dirname + '/results/'))
			.pipe(es.wait(function() {
				assert.equal(
					fs.readFileSync(__dirname + '/results/index.html', 'utf8'),
					fs.readFileSync(__dirname + '/expected/index.html', 'utf8')
				);

				fs.unlinkSync(__dirname + '/results/index.html');
				fs.rmdirSync(__dirname + '/results/');

				done();
			}));
	});
});
