var spawn = require('child_process').spawn
	, at = spawn('at', ['6:55AM', '15.01.2014']);

at.stdin.setEncoding('utf-8');
at.stdin.write('subl', function() {
	at.stdin.end();
});

at.stderr.setEncoding('utf-8');
at.stderr.on('data', function(data) {
	// Example data value: job 11 at Thu Jan 16 06:40:00 2014
	// Extract the job number.
	var regex = /job\s(\d+)\sat/i
		, matches = data.match(regex);

	if(matches) {
		console.log('Scheduled task with id', matches[1]);
	} else {
		console.log('Could not schedule task :( Error:', data);
	}
});

at.on('close', function(signal) {
	console.log('signal: ', signal);
});