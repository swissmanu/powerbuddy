var parser = require('./parser')
	, Schedule = require('./model/schedule')
	, Task = require('./model/task')
	, defaultSystemAdapter = require('./systemadapter/default');

/** Function: executeList
 * Outputs a list of all scheduled tasks to the `console`.
 */
function executeList() {
	var schedule = new Schedule();

	schedule.load()
	.then(function() {
		console.log('Scheduled tasks:');
		schedule.tasks.forEach(function(task) {
			console.log(task);
		});
	})
	.fail(function(err) {
		console.log('Could not list tasks (' + err + ')');
	});
}

/** Function: executeSchedule
 * Tries to create a <Task> using the given raw input `action`, `day` and
 * `time`. Each parameter needs to be parsed and validated before being
 * processed further.
 *
 * Parameters:
 *     (String) action - `start` or `shutdown`
 *     (String) day - A parsable day expression (see days.js)
 *     (String) time - A parsable time expression like `11pm`. (see time-js
 *                     module for suported formats)
 */
function executeSchedule(action, day, time) {
	var parsedDay = parser.parseDay(day)
		, parsedTime = parser.parseTime(time)
		, schedule = new Schedule();

	schedule.load()
	.then(function(schedule) {
		schedule.tasks.push(new Task({
			action: action
			, days: parsedDay
			, time: parsedTime
		}));

		return schedule.save();
	})
	.then(function() {
		console.log('Task scheduled');
	})
	.fail(function(err) {
		console.log('Could not schedule task (' + err + ')');
	});
}


function executeEnable() {
	var schedule = new Schedule();

	schedule.load()
	.then(function() {
		var task = schedule.getNextUpcomingTask(new Date(), Task.SHUTDOWN);
		return defaultSystemAdapter.enable(task, schedule);
	})
	.then(schedule.save.bind(schedule))
	.then(function() {
		console.log('Schedule enabled.');
	})
	.fail(function(err) {
		console.log('Could not enable schedule (' + err + ')');
	});
}

function executeDisable() {
	var schedule = new Schedule();

	schedule.load()
	.then(defaultSystemAdapter.disable.bind(defaultSystemAdapter))
	.then(schedule.save.bind(schedule))
	.then(function() {
		console.log('Schedule disabled.');
	})
	.fail(function(err) {
		console.log('Could not disable schedule (' + err + ')');
	});
}

/** Function: runCli
 * Runs a command line interface using the `commander` module. The passed
 * `parameters` argument should contain the cli arguments as in `process.argv`.
 *
 * Parameters:
 *     (Array) parameters - Cli arguments as in `process.argv`
 */
function runCli(parameters) {
	var program = require('commander')
		, packageJson = require('../package.json');

	program
		.version(packageJson.version);

	program
		.command('list')
		.description('show scheduled starts and shutdowns')
		.action(executeList)
		.on('--help', function() {
			console.log('  Examples:');
			console.log('');
			console.log('    $ powerbuddy list');
			console.log('');
		});

	program
		.command('schedule <action> <day> <time>')
		.description('schedule a task')
		.action(executeSchedule)
		.on('--help', function() {
			console.log('  Examples:');
			console.log('');
			console.log('    $ powerbuddy schedule start monday 10am');
			console.log('    $ powerbuddy schedule shutdown monday 22pm');
			console.log('    $ powerbuddy schedule start friday,monday 10am');
			console.log('    $ powerbuddy schedule shutdown everyday 22pm');
			console.log('    $ powerbuddy schedule start weekend 10am');
			console.log('    $ powerbuddy schedule start weekdays,sunday 10am');
			console.log('');
		});

	program
		.command('enable')
		.description('enable PowerBuddy')
		.action(executeEnable);

	program
		.command('disable')
		.description('disable PowerBuddy')
		.action(executeDisable);

	program.parse(parameters);
}

module.exports = runCli;