var Task = require('./task');

/** Class: SystemAdapter
 * The <SystemAdapter> adapts the information of a <Schedule> and its <Task> to
 * a system understandable instruction set. In practice this means:
 *
 *  * A shutdown task translates to a `at`-job
 *  * A start task is reflected as an entry in the
 *    `/sys/class/rtc/rtc0/wakealarm` file
 *
 * Shutdown:
 *
 * Start:
 *
 *
 */
var SystemAdapter = function SystemAdapter(options) {
	if(!options) {
		options = {};
	}

	if(!options.schedule) {
		throw new Error('No schedule option passed');
	}

	this.schedule = options.schedule;
};

SystemAdapter.prototype.scheduleNextUpcomingStart =
	function scheduleNextUpcomingStart(callback) {

	var now = new Date()
		, nextTask = this.schedule.getNextUpcomingTask(
			now
			, Task.prototype.START
		);

		if(nextTask) {
			callback(null, nextTask);
		} else {
			callback(new Error('No upcoming start task found'));
		}
};

SystemAdapter.prototype.scheduleNextUpcomingShutdown =
	function scheduleNextUpcomingShutdown(callback) {

	var now = new Date()
		, nextTask = this.schedule.getNextUpcomingTask(
			now
			, Task.prototype.SHUTDOWN
		);

	if(nextTask) {
		callback(null, nextTask);
	} else {
		callback(new Error('No upcoming shutdown task found'));
	}
};

module.exports = SystemAdapter;