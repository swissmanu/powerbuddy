var days = require('../../lib/days')
	, Schedule = require('../../lib/schedule')
	, Task = require('../../lib/task')
	, Time = require('time-js');

function createTask(day, time, action) {
	var scheduledDays = day || days.weekdays
		, taskTime = time || new Time()
		, taskAction = action || Task.SHUTDOWN
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

module.exports = {
	createTask: createTask
	, createSchedule: createSchedule
};