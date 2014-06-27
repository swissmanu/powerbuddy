var q = require('q')
	, at = require('../tooladapter/at')
	, cron = require('../tooladapter/cron')
	, rtc = require('../tooladapter/rtc')
	, Task = require('../model/task');

function enable(schedule) {
	var today = new Date()
		, nextShutdown = schedule.getNextUpcomingTask(today, Task.SHUTDOWN)
		, nextStart = schedule.getNextUpcomingTask(today, Task.START)
		, atIds = schedule.get('atIds');

	return q.all([
		at.unregister(atIds)
		, cron.register()
		, at.register(nextShutdown)
		, rtc.register(nextStart)
	])
	.then(function(results) {
		var atIds = schedule.get('atIds');

		if(Array.isArray(atIds)) {
			atIds.push(results[2]);
		} else {
			atIds = [results[2]];
		}
		schedule.set('atIds', atIds);
	});
}

function disable(schedule) {
	var atIds = schedule.get('atIds');

	return q.all([
		cron.unregister()
		, at.unregister(atIds)
		, rtc.unregister()
	])
	.then(function() {
		schedule.set('atIds', []);
	});
}

module.exports = {
	enable: enable
	, disable: disable
};