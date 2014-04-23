var days = require('../../lib/model/days')
	, Schedule = require('../../lib/model/schedule')
	, Task = require('../../lib/model/task')
	, Time = require('time-js')
	, Scheduler = require('../../lib/scheduler');

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

function createScheduler() {
	var schedule = createSchedule()
		, fakeAdapter = function(task, callback) {
			callback(null);
		}
		, scheduler = new Scheduler(
			schedule
			, fakeAdapter
			, fakeAdapter
		);

	return scheduler;
}

module.exports = {
	createTask: createTask
	, createSchedule: createSchedule
	, createScheduler: createScheduler
};