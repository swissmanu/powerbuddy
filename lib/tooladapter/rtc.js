var debug = require('debug')('powerbuddy:tooladapter:rtc')
	, fs = require('fs')
	, Task = require('../model/task')
	, moment = require('moment')
	, q = require('q')
	, rtcFile = '/sys/class/rtc/rtc0/wakealarm';

/** Function: register
 *
 * Parameters:
 *     (Task) task - The start <Task> to schedule with `rtc`
 *
 * Returns:
 *     (Promise)
 */
function register(task) {
	debug('register');

	if(task.action === Task.START) {
		var timestamp = moment(task.date).unix();
		return q.nfcall(fs.writeFile, rtcFile, timestamp, { encoding: 'utf-8'});
	} else {
		debug('task is no start task');
		return q.reject(new RangeError('Only start tasks can be ' +
			'scheduled using rtc.'));
	}
}

/** Function: unregister
 *
 * Returns:
 *     (Promise)
 */
function unregister() {
	return q.nfcall(fs.writeFile, rtcFile, '0', { encoding: 'utf-8'});
}

module.exports = {
	register: register
	, unregister: unregister
};