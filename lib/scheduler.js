var Task = require('./model/task');

/** Class: Scheduler
 * The <Scheduler> uses a <Schedule> to fetch an upcoming start or shutdown
 * <Task>. After that, a system specific scheduler function schedules the task
 * in the target system.
 *
 * <At> and <Cron> are used to schedule starts and shutdowns for the moment
 * only. The `startAdapter` and `shutdownAdapter` arguments can overwrite these
 * adapter functions, but are only used for testing currently.
 *
 * Parameters:
 *     (Schedule) schedule - A <Schedule> to read upcoming <Task>s from
 *     (Function) startAdapter - A function used to schedule a system startup.
 *                               Optional. If not given, <At> is used by
 *                               default.
 *     (Function) shutdownAdapter - A function used to schedule system
 *                                  shutdowns. Optional. If not given, <Cron> is
 *                                  used by default.
 */
var Scheduler = function Scheduler(schedule, startAdapter, shutdownAdapter) {
	if(!schedule) {
		throw new Error('No `schedule` passed');
	}

	this.schedule = schedule;
	this.startAdapter = startAdapter || require('./systemadapter/cron');
	this.shutdownAdapter = shutdownAdapter || require('./systemadapter/at');
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

	if(!callback) {
		callback = function() {};
	}

	if(nextTask) {
		this.startAdapter(nextTask, function(err) {
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

	if(!callback) {
		callback = function() {};
	}

	if(nextTask) {
		this.shutdownAdapter(nextTask, function(err) {
			callback(err, nextTask);
		});
	} else {
		callback(new Error('No upcoming shutdown task found'));
	}
};

module.exports = Scheduler;