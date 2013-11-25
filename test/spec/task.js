/* global describe, it, expect */
describe('Task', function() {
	var Task = require('../../lib/task')
		, daydefinition = require('../../lib/daydefinition');

	it('should take an array of day indices with its constructor options argument', function() {
		var days = daydefinition.weekdays
			, testTask = new Task({ days: days });
		expect(testTask.days).to.be.equal(days);
	});

});