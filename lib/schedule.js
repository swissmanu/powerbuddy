var fs = require('fs')
	, path = require('path');


var Schedule = function Schedule(options) {
	this.file = path.join('~', '.powerbuddy');

	if(options) {
		this.file = options.file || this.file;
	}

	this.load();
};

Schedule.prototype.load = function load() {

};

Schedule.prototype.save = function save() {
	var json = JSON.stringify({yay:true});
	fs.writeFileSync(this.file, json, { encoding: 'utf-8' });
};

module.exports = Schedule;