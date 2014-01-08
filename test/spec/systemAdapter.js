describe('SystemAdapter', function() {
	var SystemAdapter = require('../../lib/systemAdapter')
		, fakeFactory = require('../lib/fakeFactory');

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
		it('should be a function', function() {
			var systemAdapter = fakeFactory.createSystemAdapter();
			expect(systemAdapter.scheduleNextUpcomingStart).to.be.a('function');
		});
	});

	describe('scheduleNextUpcomingShutdown', function() {
		it('should be a function', function() {
			var systemAdapter = fakeFactory.createSystemAdapter();
			expect(systemAdapter.scheduleNextUpcomingShutdown).to.be.a('function');
		});
	});

});