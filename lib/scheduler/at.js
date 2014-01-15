var spawn = require('child_process').spawn;

/** Function: scheduleWithAt
 * Schedules the execution of a <Task> using unix' `at` system utilities. To
 * accomplish this, `at` is started as a child process using time and date of
 * the <Task> as parameters. The actual action is written to `at`s `stdin`.
 * After closing stdin, the `stderr` stream returns a message like
 * `job 11 at Thu Jan 16 06:40:00 2014` containing an identifier of the
 * scheduled task.
 *
 * The `callback` from the arguments is called after completing the scheduling.
 * After success, the first parameter contains `null`, the second the job id
 * which `at` assigned to our freshly scheduled job. If there was a problem,
 * only an `Error` object with error description is given as first argument.
 *
 * See also:
 * * http://unixhelp.ed.ac.uk/CGI/man-cgi?at
 *
 * Parameters:
 *     (Task) task - The task to schedule using `at`
 *     (Function) callback - Called after completion
 */
function scheduleWithAt(task, callback) {
	var childProcess
		, errorText
		, jobId
		, time = task.date.getHours() + ':' + task.date.getMinutes()
		, date = task.date.getDate() + '.' +
			(task.date.getMonth()+1) + '.' +
			task.date.getFullYear();

	childProcess = spawn('at', [time, date]);
	childProcess.stdin.setEncoding('utf-8');
	childProcess.stderr.setEncoding('utf-8');

	// Feed the action to `at` and close stdin afterwards:
	childProcess.stdin.write('subl', function() {
		childProcess.stdin.end();
	});

	// Fetch any errors or the successful scheduled job id:
	childProcess.stderr.on('data', function(data) {
		// Example data value: job 11 at Thu Jan 16 06:40:00 2014
		var jobidExtractor = /job\s(\d+)\sat/i
			, matches = data.match(jobidExtractor);

		if(matches) {
			jobId = matches[1];
		} else {
			errorText = data;
		}
	});

	// Execute the callback after child process terminates:
	childProcess.on('close', function(signal) {
		if(callback) {
			if(signal === 0) {
				callback(null, jobId);
			} else {
				callback(new Error('Scheduling task with `at` returned ' +
					'signal ' + signal + '. stderr was: ' + errorText));
			}
		}
	});
}

module.exports = scheduleWithAt;