'use strict';

var util = require('gulp-util'),
	through = require('through2'),
	glob = require('glob'),
	path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	handlebars = require('handlebars'),
	pluginName = 'gulp-unic-handlebars';

module.exports = function(options) {
	options = _.merge({
		data: {},
		partials: null,
		getPartialName: function(filePath) {
			var extension = path.extname(filePath),
				name = path.relative('./source/', filePath).replace(extension, '');

			return name.split(path.sep).join('/');
		}
	}, options || {});

	// Register partials
	if (options.partials) {
		if (!_.isArray(options.partials)) {
			options.partials = [options.partials];
		}

		options.partials.forEach(function(pattern) {
			glob.sync(pattern).forEach(function(file) {
				var name = options.getPartialName(file),
					content;

				content = fs.readFileSync(file, 'utf8').toString();

				handlebars.registerPartial(name, content);
			});
		});
	}

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			this.push(file);

			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new util.PluginError(pluginName, 'Streaming not supported'));

			return cb();
		}

		var contents = file.contents.toString(),
			data = options.data,
			html = '',
			template;

		try {
			template = handlebars.compile(contents);

			// Get template data
			if (typeof data === 'function') {
				data = options.data(file);
			}

			html = template(data);
		} catch (err) {
			this.emit('error', new util.PluginError(pluginName, err));
		}

		file.contents = new Buffer(html);

		// Add file back to stream
		this.push(file);

		cb();
	});
};
