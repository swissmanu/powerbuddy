var parser = require('./parser');

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
		, parsedTime = parser.parseTime(time);

	console.log(action, parsedDay, parsedTime.toString());
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

	program.parse(parameters);
}

module.exports = runCli;