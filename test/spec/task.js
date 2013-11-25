/* global describe, it, expect */
describe('Task', function() {
	var Task = require('../../lib/task')
		, days = require('../../lib/days');

	it('should take an array of day indices with its constructor options argument', function() {
		var weekdays = days.weekdays
			, testTask = new Task({ days: weekdays });
		expect(testTask.days).to.be.equal(weekdays);
	});

});