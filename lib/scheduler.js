var Task = require('./model/task');

/** Class: Scheduler
 * The <Scheduler> adapts the information of a <Schedule> and its <Task> to
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
var Scheduler = function Scheduler(options) {
	if(!options) {
		options = {};
	}

	if(!options.schedule) {
		throw new Error('No schedule option passed');
	}

	this.schedule = options.schedule;
};



/** Function: scheduleNextUpcomingStart
 *
 *
 * See also:
 *     * <scheduleWithAt>
 *
 * Parameters:
 *     (Function) callback
 *     (Function) scheduler - Scheduler function to schedule the next upcoming
 *                            task.
 */
Scheduler.prototype.scheduleNextUpcomingStart =
	function scheduleNextUpcomingStart(callback, scheduler) {

	if(!scheduler) {
		callback(new Error('Called without passing a scheduler.'));
	}


	var now = new Date()
		, nextTask = this.schedule.getNextUpcomingTask(
			now
			, Task.prototype.START
		);

	if(nextTask) {
		scheduler(nextTask, function(err) {
			if(err === null) {
				callback(null, nextTask);
			} else {
				callback(err, nextTask);
			}
		});
	} else {
		callback(new Error('No upcoming start task found'));
	}
};

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