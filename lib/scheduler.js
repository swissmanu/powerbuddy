var Task = require('./model/task');

/** Class: Scheduler
 * The <Scheduler> uses a <Schedule> to fetch an upcoming start or shutdown
 * <Task>. After that, a system specific scheduler function schedules the task
 * in the target system.
 */
var Scheduler = function Scheduler(options) {
	if(!options) {
		options = {};
	}

	if(!options.schedule) {
		throw new Error('No `schedule` option passed');
	}

	if(!options.scheduler) {
		throw new Error('No `scheduler` option passed');
	}

	this.schedule = options.schedule;
	this.scheduler = options.scheduler;
};



/** Function: scheduleNextUpcomingStart
 *
 * Parameters:
 *     (Function) callback - called upon completion.
 */
Scheduler.prototype.scheduleNextUpcomingStart =
	function scheduleNextUpcomingStart(callback) {

	var now = new Date()
		, nextTask = this.schedule.getNextUpcomingTask(
			now
			, Task.prototype.START
		);

	if(nextTask) {
		this.scheduler(nextTask, function(err) {
			callback(err, nextTask);
		});
	} else {
		callback(new Error('No upcoming start task found'));
	}
};

/** Function: scheduleNextUpcomingShutdown
 *
 * Parameter:
 *     (Function) callback - called upon completion
 */
Scheduler.prototype.scheduleNextUpcomingShutdown =
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

module.exports = Scheduler;