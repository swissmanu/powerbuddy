/* global describe, it, expect */
describe('Day Definitions', function() {
	var days = require('../../lib/days');

	it('should define sunday with value 0', function() {
		expect(days.sunday).to.be(0);
	});
	it('should define monday with value 1', function() {
		expect(days.monday).to.be(1);
	});
	it('should define tuesday with value 2', function() {
		expect(days.tuesday).to.be(2);
	});
	it('should define wednesday with value 3', function() {
		expect(days.wednesday).to.be(3);
	});
	it('should define thursday with value 4', function() {
		expect(days.thursday).to.be(4);
	});
	it('should define fridays with value 5', function() {
		expect(days.friday).to.be(5);
	});
	it('should define saturday with value 6', function() {
		expect(days.saturday).to.be(6);
	});

	it('should define everyday with all days', function() {
		expect(days.everyday).to.be.eql([
			days.sunday
			, days.monday
			, days.tuesday
			, days.wednesday
			, days.thursday
			, days.friday
			, days.saturday
		]);
	});
	it('should define weekdays with monday, tuesday, wednesday, thursday and friday', function() {
		expect(days.weekdays).to.be.eql([
			days.monday
			, days.tuesday
			, days.wednesday
			, days.thursday
			, days.friday
		]);
	});
	it('should define weekend with saturday and sunday', function() {
		expect(days.weekend).to.be.eql([
			days.sunday
			, days.saturday
		]);
	});

});