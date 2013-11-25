/* global describe, it, expect */
describe('Day Definitions', function() {
	var daydefinition = require('../../lib/daydefinition');

	it('should define sunday with value 0', function() {
		expect(daydefinition.sunday).to.be(0);
	});
	it('should define monday with value 1', function() {
		expect(daydefinition.monday).to.be(1);
	});
	it('should define tuesday with value 2', function() {
		expect(daydefinition.tuesday).to.be(2);
	});
	it('should define wednesday with value 3', function() {
		expect(daydefinition.wednesday).to.be(3);
	});
	it('should define thursday with value 4', function() {
		expect(daydefinition.thursday).to.be(4);
	});
	it('should define fridays with value 5', function() {
		expect(daydefinition.friday).to.be(5);
	});
	it('should define saturday with value 6', function() {
		expect(daydefinition.saturday).to.be(6);
	});

	it('should define everyday with all days', function() {
		expect(daydefinition.everyday).to.be.eql([
			daydefinition.sunday
			, daydefinition.monday
			, daydefinition.tuesday
			, daydefinition.wednesday
			, daydefinition.thursday
			, daydefinition.friday
			, daydefinition.saturday
		]);
	});
	it('should define weekdays with monday, tuesday, wednesday, thursday and friday', function() {
		expect(daydefinition.weekdays).to.be.eql([
			daydefinition.monday
			, daydefinition.tuesday
			, daydefinition.wednesday
			, daydefinition.thursday
			, daydefinition.friday
		]);
	});
	it('should define weekend with saturday and sunday', function() {
		expect(daydefinition.weekend).to.be.eql([
			daydefinition.sunday
			, daydefinition.saturday
		]);
	});

});