/* global describe, it, expect, beforeEach */
describe('SystemAdapter', function() {
	var SystemAdapter = require('../../lib/systemAdapter')
		, Task = require('../../lib/task')
		, fakeFactory = require('../lib/fakeFactory')
		, days = require('../../lib/days');

	it('should throw an error on creation, if no schedule is passed', function() {
		expect(function() {
			new SystemAdapter();
		}).to.throwError();
	});

	it('should take a schedule option on creation', function() {
		var fakeSchedule = { foo: 'bar' }
			, systemAdapter = new SystemAdapter({
				schedule: fakeSchedule
			});

		expect(systemAdapter.schedule).to.be.equal(fakeSchedule);
	});

	describe('scheduleNextUpcomingStart', function() {
		var systemAdapter;

		beforeEach(function() {
			systemAdapter = fakeFactory.createSystemAdapter();
			systemAdapter.schedule.tasks[0].action = Task.prototype.START;
		});

		it('should be a function', function() {
			expect(systemAdapter.scheduleNextUpcomingStart).to.be.a('function');
		});

		it('should resolve the callback with an error if no task was found', function(done) {
			systemAdapter.schedule.tasks = [];
			systemAdapter.scheduleNextUpcomingStart(function(err) {
				expect(err.toString()).to.be.equal('Error: No upcoming start task found');
				done();
			});
		});

		it('should return the scheduled task after scheduling successfully', function(done) {
			systemAdapter.scheduleNextUpcomingStart(function(err, scheduledTask) {
				expect(err).to.be(null);
				expect(scheduledTask).to.be.eql(systemAdapter.schedule.tasks[0]);
				done();
			});
		});
	});

	describe('scheduleNextUpcomingShutdown', function() {
		var systemAdapter;

		beforeEach(function() {
			systemAdapter = fakeFactory.createSystemAdapter();
		});

		it('should be a function', function() {
			expect(systemAdapter.scheduleNextUpcomingShutdown).to.be.a('function');
		});

		it('should resolve the callback with an error if no task was found', function(done) {
			systemAdapter.schedule.tasks = [];
			systemAdapter.scheduleNextUpcomingShutdown(function(err) {
				expect(err.toString()).to.be.equal('Error: No upcoming shutdown task found');
				done();
			});
		});

		it('should return the scheduled task after scheduling successfully', function(done) {
			systemAdapter.scheduleNextUpcomingShutdown(function(err, scheduledTask) {
				expect(err).to.be(null);
				expect(scheduledTask).to.be.eql(systemAdapter.schedule.tasks[0]);
				done();
			});
		});
	});

});