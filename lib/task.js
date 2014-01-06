var days = require('./days');

var Task = function Task(options) {
	this.days = [];
	this.startTime = undefined;
	this.shutdownTime = undefined;

	if(options) {
		this.days = options.days || this.days;
		this.startTime = options.startTime || this.startTime;
		this.shutdownTime = options.shutdownTime || this.shutdownTime;
	}
};

Task.prototype.toJSON = function toJSON() {
	return {
		days: this.days
		, startTime: this.startTime.toString()
		, shutdownTime: this.shutdownTime.toString()
	};
};

module.exports = Task;