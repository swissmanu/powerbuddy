/*var spawn = require('child_process').spawn
	, at = spawn('at', ['7:14AM', '23.04.2014']);

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
});*/

/*var days = require('./lib/model/days')
	, factory = require('./test/lib/fakeFactory')
	, Time = require('time-js')
	, Scheduler = require('./lib/scheduler')
	, Task = require('./lib/model/task')
	, schedule = factory.createSchedule([
		factory.createTask(
			days.monday, new Time('07:30am'), Task.prototype.START)
	])
	, fakeAdapter = function fakeAdapter(task, callback) {
		console.log('>>>>>>>>>> fakeAdapter', task);
	}
	, scheduler = new Scheduler(schedule, fakeAdapter, fakeAdapter);

scheduler.scheduleNextUpcomingShutdown(function(err) {
	console.log(err);
});
scheduler.scheduleNextUpcomingStart(function(err) {
	console.log(err);
});
*/

var crontab = require('crontab');

crontab.load(function(err, tab) {
	var jobs = tab.getJobs();

	if(jobs.length > 0) {
		tab.remove(tab.findComment('PowerBuddy'));
	} else {
		var job = tab.create('echo `date` >> /home/vagrant/buffer');
		job.everyReboot();
		job.comment('PowerBuddy');
	}

	tab.save(function(err) {
		console.log(err, 'saved!');
	});
});