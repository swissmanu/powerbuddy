var Task = function Task(options) {
	if(!options) {
		options = {};
	}
	if(options.days && !Array.isArray(options.days)) {
		options.days = [ options.days ];
	}

	this.days = options.days || [];
	this.time = options.time || undefined;
	this.action = options.action || undefined;
};

Task.prototype.toJSON = function toJSON() {
	return {
		days: this.days
		, time: this.time.toString()
		, action: this.action
	};
};

Task.prototype.SHUTDOWN = 'shutdown';
Task.prototype.START = 'start';

module.exports = Task;