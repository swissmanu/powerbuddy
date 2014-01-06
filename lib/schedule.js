var fs = require('fs')
	, path = require('path')
	, Task = require('./task')
	, Time = require('time-js');


var Schedule = function Schedule(options) {
	if(!options) {
		options = {};
	}

	this.file = options.file || path.join('~', '.powerbuddy');
	this.tasks = options.tasks || [];
};

Schedule.prototype.toJSON = function toJSON() {
	var jsonTasks = [];

	this.tasks.forEach(function(task) {
		jsonTasks.push(task.toJSON());
	});

	return { tasks: jsonTasks };
};

Schedule.prototype.load = function load(callback) {
	var self = this
		, loadCallback = callback || function() {};

	fs.readFile(this.file, { encoding: 'utf-8' }, function(err, data) {
		if(!err) {
			var deserialized;
			self.tasks = [];

			try {
				deserialized = JSON.parse(data);
				deserialized.tasks.forEach(function(task) {
					self.tasks.push(new Task({
						days: task.days
						, startTime: new Time(task.startTime)
						, shutdownTime: new Time(task.shutdownTime)
					}));
				});
			} catch(e) {
				err = e;
			}
		}

		loadCallback(err, self);
	});
};

Schedule.prototype.save = function save(callback) {
	var prepared = this.toJSON()
		, json = JSON.stringify(prepared)
		, writeCallback = callback || function() {};

	fs.writeFile(this.file, json, { encoding: 'utf-8' }, writeCallback);
};

module.exports = Schedule;