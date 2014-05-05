/* global describe, it, expect, beforeEach */
describe('Scheduler', function() {
	var Scheduler = require('../../lib/scheduler')
		, Task = require('../../lib/model/task')
		, fakeFactory = require('../lib/fakeFactory')
		, days = require('../../lib/model/days')
		, noOp = function() {};

	it('should throw an error on creation, if no schedule is passed', function() {
		expect(function() {
			new Scheduler(undefined, noOp, noOp);
		}).to.throwError();
	});

	it('should take a schedule argument on creation', function() {
		var fakeSchedule = { foo: 'bar' }
			, scheduler = new Scheduler(fakeSchedule, noOp, noOp);

		expect(scheduler.schedule).to.be.equal(fakeSchedule);
	});

	describe('scheduleNextUpcomingStart', function() {
		var scheduler;

		beforeEach(function() {
			scheduler = fakeFactory.createScheduler();
			scheduler.schedule.tasks[0].action = Task.prototype.START;
		});

		it('should be a function', function() {
			expect(scheduler.scheduleNextUpcomingStart).to.be.a('function');
		});

		it('should resolve the callback with an error if no task was found', function(done) {
			scheduler.schedule.tasks = [];
			scheduler.scheduleNextUpcomingStart(function(err) {
				expect(err.toString()).to.be.equal('Error: No upcoming start task found');
				done();
			});
		});

		it('should return the scheduled task after scheduling successfully', function(done) {
			scheduler.scheduleNextUpcomingStart(function(err, scheduledTask) {
				expect(err).to.be(null);
				expect(scheduledTask.date).not.to.be(undefined);
				expect(scheduledTask.task).to.be.eql(scheduler.schedule.tasks[0]);
				done();
			});
		});
	});

	describe('scheduleNextUpcomingShutdown', function() {
		var scheduler;

		beforeEach(function() {
			scheduler = fakeFactory.createScheduler();
		});

		it('should be a function', function() {
			expect(scheduler.scheduleNextUpcomingShutdown).to.be.a('function');
		});

		it('should resolve the callback with an error if no task was found', function(done) {
			scheduler.schedule.tasks = [];
			scheduler.scheduleNextUpcomingShutdown(function(err) {
				expect(err.toString()).to.be.equal('Error: No upcoming shutdown task found');
				done();
			});
		});

		it('should return the scheduled task after scheduling successfully', function(done) {
			scheduler.scheduleNextUpcomingShutdown(function(err, scheduledTask) {
				expect(err).to.be(null);
				expect(scheduledTask.date).not.to.be(undefined);
				expect(scheduledTask.task).to.be.eql(scheduler.schedule.tasks[0]);
				done();
			});
		});
	});

});