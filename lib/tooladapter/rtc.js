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
function register(task, simulate) {
	debug('register');

	if(task.action === Task.START) {
		var timestamp = moment(task.date).unix();

		if(!simulate) {
			return q.nfcall(fs.writeFile, rtcFile, timestamp, {
				encoding: 'utf-8'
			});
		} else {
			console.log('SIMULATE: write ' + timestamp + ' (' +
				moment(task.date).format() + ') to ' + rtcFile);
			return q.when();
		}
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
function unregister(simulate) {
	if(!simulate) {
		return q.nfcall(fs.writeFile, rtcFile, '0', { encoding: 'utf-8'});
	} else {
		console.log('SIMULATE: reset ' + rtcFile);
		return q.when();
	}
}

module.exports = {
	register: register
	, unregister: unregister
};