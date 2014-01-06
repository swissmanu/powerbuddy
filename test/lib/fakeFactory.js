var days = require('../../lib/days')
	, Schedule = require('../../lib/schedule')
	, Task = require('../../lib/task')
	, Time = require('time-js');

function createTask(day, startTime, shutdownTime) {
	var scheduledDays = day || days.weekdays
		, start = startTime || new Time()
		, shutdown = shutdownTime || new Time()
		, task = new Task({
			days: scheduledDays
			, startTime: start
			, shutdownTime: shutdown
		});

	return task;
}

function createSchedule(tasks) {
	var schedule = new Schedule()
		, scheduledTasks = tasks || [ createTask() ];

	scheduledTasks.forEach(function(task) {
		schedule.tasks.push(task);
	});

	return schedule;
}

module.exports = {
	createTask: createTask
	, createSchedule: createSchedule
};