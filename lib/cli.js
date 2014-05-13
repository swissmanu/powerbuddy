var parser = require('./parser')
	, Schedule = require('./model/schedule')
	, Task = require('./model/task')
	, q = require('q')
	, at = require('./systemadapter/at')
	, cron = require('./systemadapter/cron');

/** Function: executeList
 * Outputs a list of all scheduled tasks to the `console`.
 */
function executeList() {
	console.log('list');
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

	schedule.load(function(err) {

		schedule.tasks.push(new Task({
			action: action
			, days: parsedDay
			, time: parsedTime
		}));

		schedule.save(function(err) {
			if(!err) {
				console.log('Scheduled task');
			} else {
				console.log(err);
			}
		});
	});
}


function executeEnable() {
	var schedule = new Schedule()
		, task;

	schedule.load(function(err) {
		if(!err) {
			task = schedule.getNextUpcomingTask(new Date(), Task.SHUTDOWN);

			q.all([
				at.register(task)
				, cron.register(task)
			])
			.then(function(results) {
				console.log('done');

				var atIds = schedule.get('atIds');
				if(Array.isArray(atIds)) {
					atIds.push(results[0]);
				} else {
					atIds = [results[0]];
				}
				schedule.set('atIds', atIds);
				schedule.save();
			})
			.fail(function(err) {
				console.log('failed :(' + err);
			});

		} else {
			console.log('Error load', err);
		}

	});

}

function executeDisable() {
	var schedule = new Schedule();
	schedule.load(function(err) {
		var atIds = schedule.get('atIds');

		q.all([
			at.unregister(atIds)
			, cron.unregister()
		])
		.then(function() {
			console.log('done');
			schedule.set('atIds', []);
			schedule.save();
		})
		.fail(function(err) {
			console.log('failed :(' + err);
		});

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