var days = require('../../lib/days')
	, Schedule = require('../../lib/schedule')
	, Task = require('../../lib/task')
	, Time = require('time-js')
	, SystemAdapter = require('../../lib/systemAdapter');

function createTask(day, time, action) {
	var scheduledDays = day || days.weekdays
		, taskTime = time || new Time()
		, taskAction = action || Task.prototype.SHUTDOWN
		, task = new Task({
			days: scheduledDays
			, time: taskTime
			, action: taskAction
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

function createSystemAdapter() {
	var schedule = createSchedule()
		, systemAdapter = new SystemAdapter({
			schedule: schedule
		});

	return systemAdapter;
}

module.exports = {
	createTask: createTask
	, createSchedule: createSchedule
	, createSystemAdapter: createSystemAdapter
};