/** Class: SystemAdapter
 * The <SystemAdapter> adapts the information of a <Schedule> and its <Task> to
 * a system understandable instruction set. In practice this means:
 *
 *  * A shutdown task translates to a one-time cron job
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

SystemAdapter.prototype.scheduleNextUpcomingStart = function scheduleNextUpcomingStart() {

};

SystemAdapter.prototype.scheduleNextUpcomingShutdown = function scheduleNextUpcomingShutdown() {

};

module.exports = SystemAdapter;