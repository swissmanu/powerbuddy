var childProcess = require('child_process')
	, moment = require('moment')
	, q = require('q');


function registerAtJob(task) {
	var buffer = []
		, momentDate = moment(task.date)
		, time = momentDate.format('h:mma')
		, date = momentDate.format('DD.MM.YYYY')
		, at = childProcess.spawn('at', [time, date], {
			inherit: [ process.stdin, process.stderr ]}
		)
		, deferred = q.defer();

	at.stdin.setEncoding('utf-8');
	at.stdin.write('sudo shutdown -P now');
	at.stdin.end();


	at.stderr.setEncoding('utf-8');
	at.stderr.on('data', function(data) {
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
			deferred.resolve(id);
		} else {
			deferred.reject(new Error('Could not schedule task (' + data + ')'));
		}
	});

	return deferred.promise;
}

function deleteAtJob(ids) {
	if(!Array.isArray(ids)) {
		ids = [ids];
	}

	var deferred = q.defer();

	if(ids.length > 0) {
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
		deferred.resolve();
	}

	return deferred.promise;
}



module.exports = {
	register: registerAtJob
	, unregister: deleteAtJob
};