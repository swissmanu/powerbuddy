var q = require('q')
	, at = require('../tooladapter/at')
	, cron = require('../tooladapter/cron');

function enable(task, schedule) {
	return q.all([
		at.unregister(schedule.get('atIds'))
		, at.register(task)
		, cron.register(task)
	])
	.then(function(results) {
		var atIds = schedule.get('atIds');

		if(Array.isArray(atIds)) {
			atIds.push(results[1]);
		} else {
			atIds = [results[1]];
		}
		schedule.set('atIds', atIds);
	});
}

function disable(schedule) {
	var atIds = schedule.get('atIds');

	return q.all([
		at.unregister(atIds)
		, cron.unregister()
	])
	.then(function() {
		schedule.set('atIds', []);
	});
}

module.exports = {
	enable: enable
	, disable: disable
};