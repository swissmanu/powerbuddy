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

	it('should take a start time with its constructor options argument', function() {
		var startTime = new Time()
			, testTask = new Task({ startTime: startTime });

		expect(testTask.startTime).to.be.eql(startTime);
	});

	it('should take a shutdown time with its constructor options argument', function() {
		var shutdownTime = new Time()
			, testTask = new Task({ shutdownTime: shutdownTime });

		expect(testTask.shutdownTime).to.be.eql(shutdownTime);
	});

	describe('toJSON', function() {
		it('should return the tasks information in a simplified object, ready to be stringified', function() {
			var weekdays = days.weekdays
				, startTime = new Time()
				, shutdownTime = new Time()
				, testTask = fakeFactory.createTask(weekdays, startTime, shutdownTime)
				, expected = {
					days: weekdays
					, startTime: startTime.toString()
					, shutdownTime: shutdownTime.toString()
				};

			expect(testTask.toJSON()).to.be.eql(expected);
		});
	});

});