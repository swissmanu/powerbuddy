var daydefinition = require('./daydefinition');

var Task = function Task(options) {
	this.days = [];

	if(options) {
		this.days = options.days || this.days;
	}
};

Task.prototype.save = function(storage) {

};

module.exports = Task;