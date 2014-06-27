var debug = require('debug')('powerbuddy:tooladapter:at')
	, childProcess = require('child_process')
	, Task = require('../model/task')
	, moment = require('moment')
	, q = require('q');

/** Function: register
 * Schedules given <Task> to be executed with `at`.
 *
 * After the <Task> was successfully scheduled, `at` returns an id which allows
 * to identify the scheduled task/job. That id is passed when the functions
 * promise gets resolved.
 *
 * If the passed <Task>s action is not equal to <Task.SHUTDOWN>, the returned
 * promise is rejected with a proper error.
 *
 * Parameters:
 *     (Task) task - The <Task> to schedule with `at`
 *
 * Returns:
 *     (Promise)
 */
function register(task) {
	debug('register');

	var deferred = q.defer();

	if(task.action === Task.SHUTDOWN) {
		debug('register shutdown task with at');

		var buffer = []
			, momentDate = moment(task.date)
			, time = momentDate.format('h:mma')
			, date = momentDate.format('DD.MM.YYYY')
			, at = childProcess.spawn('at', [time, date], {
				inherit: [ process.stdin, process.stderr ]}
			);


		at.stdin.setEncoding('utf-8');
		at.stdin.write('sudo shutdown -P now');
		at.stdin.end();


		at.stderr.setEncoding('utf-8');
		at.stderr.on('data', function(data) {
			debug('got data from stderr: ' + data);
			buffer.push(data);
		});

		at.stderr.on('close', function() {
			// Example data value: job 11 at Thu Jan 16 06:40:00 2014
			// Extract the job number.
			var regex = /job\s(\d+)\sat/i
				, data = buffer.join('')
				, matches = data.match(regex);

			if(matches) {
				var id = matches[1];
				debug('fetched scheduled task id: ' + id);
				deferred.resolve(id);
			} else {
				debug('could not fetch at task id from data: ' + data);
				deferred.reject(new Error(data));
			}
		});
	} else {
		debug('task is no shutdown task');
		deferred.reject(new RangeError('Only shutdown tasks can be ' +
			'scheduled using at.'));
	}

	return deferred.promise;
}

/** Function: unregister
 * Expects an array of ids representing tasks scheduled with `at`. Each id is
 * passed to the `atrm` shell command to unschedule the specific job.
 *
 * If a job id does not point to a currently scheduled job, no error is
 * returned.
 *
 * Parameters:
 *     (String|Array) ids - ids to unschedule
 *
 * Returns:
 *     (Promise)
 */
function unregister(ids) {
	var deferred = q.defer();

	if(!Array.isArray(ids)) {
		ids = [ids].filter(function(id) { return id !== undefined; });
	}

	if(ids.length > 0) {
		debug('unregister ' + ids.length + ' task(s)');
		childProcess.exec('atrm ' + ids.join(' '), function(err) {
			if(err) {
				var text = err.toString();
				if(text.indexOf('Cannot find job') === -1) {
					deferred.reject(err);
				} else {
					deferred.resolve();
				}
			} else {
				deferred.resolve();
			}
		});
	} else {
		debug('no tasks to unregister');
		deferred.resolve();
	}

	return deferred.promise;
}



module.exports = {
	register: register
	, unregister: unregister
};