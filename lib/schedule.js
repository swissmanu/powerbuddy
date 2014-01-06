var fs = require('fs')
	, path = require('path');


var Schedule = function Schedule(options) {
	this.file = path.join('~', '.powerbuddy');
	this.tasks = [];

	if(options) {
		this.file = options.file || this.file;
	}

	this.load();
};

Schedule.prototype.toJSON = function toJSON() {
	var jsonTasks = [];

	this.tasks.forEach(function(task) {
		jsonTasks.push(task.toJSON());
	});

	return { tasks: jsonTasks };
};

Schedule.prototype.load = function load() {

};

Schedule.prototype.save = function save(callback) {
	var prepared = this.toJSON()
		, json = JSON.stringify(prepared);

	fs.writeFile(this.file, json, { encoding: 'utf-8' }, callback);
};

module.exports = Schedule;