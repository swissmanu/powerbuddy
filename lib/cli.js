#!/usr/bin/env node

var program = require('commander')
	, packageJson = require('../package.json');

function list(val) {
	return val.split(',');
}

program
	.version(packageJson.version)
	.option('list', 'show scheduled starts and shutdowns')
	.option('plan <day> <start> <shutdown>', 'plan a start/shutdown pair')
	.option('plan <days> <start> <shutdown>', 'plan a start/shutdown pair for several days', list)
	.option('start <day> <time>', 'plan start')
	.option('start <days> <time>', 'plan start for several days', list)
	.option('shutdown <day> <time>', 'plan shutdown')
	.option('shutdown <days> <time>', 'plan shutdown for several days', list)
	.option('delete <id>', 'delete scheduled start/shutdown by id (retreive with `list`)')
	.on('--help', function() {
		console.log('  Examples:');
		console.log('');
		console.log('    $ powerbuddy list');
		console.log('    $ powerbuddy plan monday 10:00 22:00');
		console.log('    $ powerbuddy plan friday,monday 10:00 22:00');
		console.log('    $ powerbuddy start weekend 10:00');
		console.log('    $ powerbuddy shutdown weekday 00:00');
		console.log('    $ powerbuddy delete 1');
		console.log('');
	})
	.parse(process.argv);

function executeList() {
	console.log('list');
}

function executePlan() {
	console.log('plan');
}

function executePlanStart() {
	console.log('planStart');
}

function executePlanShutdown() {
	console.log('planShutdown');
}

function executeDelete() {
	console.log('delete');
}

if(program.list) {
	executeList();
} else if(program.plan) {
	executePlan();
} else if(program.start) {
	executePlanStart();
} else if(program.shutdown) {
	executePlanShutdown();
} else if(program.delete) {
	executeDelete();
} else {
	program.help();
}