/* global describe, it, expect */
describe('Task', function() {
	var Task = require('../../lib/task')
		, fakeFactory = require('../lib/fakeFactory')
		, days = require('../../lib/days')
		, Time = require('time-js');

	it('should take an array of day indices with its constructor options argument', function() {
		var weekdays = days.weekdays
			, testTask = new Task({ days: weekdays });
		expect(testTask.days).to.be.eql(weekdays);
	});

	it('should take a time and type with its constructor options argument', function() {
		var time = new Time()
			, action = Task.SHUTDOWN
			, testTask = new Task({ time: time, action: action });

		expect(testTask.time.toString()).to.be.equal(time.toString());
		expect(testTask.action).to.be.equal(action);
	});

	describe('toJSON', function() {
		it('should return the tasks information in a simplified object, ready to be stringified', function() {
			var weekdays = days.weekdays
				, time = new Time()
				, action = Task.SHUTDOWN
				, testTask = fakeFactory.createTask(weekdays, time, action)
				, expected = {
					days: weekdays
					, time: time.toString()
					, action: action
				};

			expect(testTask.toJSON()).to.be.eql(expected);
		});
	});

});