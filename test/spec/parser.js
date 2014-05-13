/* global describe, it, expect */
describe('Parser', function() {
	var parser = require('../../lib/parser');

	describe('parseTime', function() {
		it('should return an instance of timejs', function() {
			var time = parser.parseTime('12:00');

			expect(time.hours).to.be.a(Function);
			expect(time.minutes).to.be.a(Function);
			expect(time.period).to.be.a(Function);
		});
	});

	describe('parseDay', function() {
		it('should be a function', function() {
			expect(parser.parseDay).to.be.a('function');
		});

		it('should parse "sunday" as [0]', function() {
			expect(parser.parseDay('sunday')).to.eql([0]);
		});
		it('should parse "monday" as [1]', function() {
			expect(parser.parseDay('monday')).to.eql([1]);
		});
		it('should parse "tuesday" as [2]', function() {
			expect(parser.parseDay('tuesday')).to.eql([2]);
		});
		it('should parse "wednesday" as [3]', function() {
			expect(parser.parseDay('wednesday')).to.eql([3]);
		});
		it('should parse "thursday" as [4]', function() {
			expect(parser.parseDay('thursday')).to.eql([4]);
		});
		it('should parse "friday" as [5]', function() {
			expect(parser.parseDay('friday')).to.eql([5]);
		});
		it('should parse "saturday" as [6]', function() {
			expect(parser.parseDay('saturday')).to.eql([6]);
		});

		it('should parse "weekend" as [0,6]', function() {
			expect(parser.parseDay('weekend')).to.eql([0,6]);
		});
		it('should parse "weekdays" as [1,2,3,4,5]', function() {
			expect(parser.parseDay('weekdays')).to.eql([1,2,3,4,5]);
		});
		it('should parse "weekends" as [0,6]', function() {
			expect(parser.parseDay('weekends')).to.eql([0,6]);
		});
		it('should parse "weekday" as [1,2,3,4,5]', function() {
			expect(parser.parseDay('weekday')).to.eql([1,2,3,4,5]);
		});
		it('should parse "everday" as [0,1,2,3,4,5,6]', function() {
			expect(parser.parseDay('everyday')).to.eql([0,1,2,3,4,5,6]);
		});

		it('should recognize mixed case strings as their lowercase equivalent', function() {
			expect(parser.parseDay('mOnDAy')).to.eql([1]);
		});

		it('should parse comma separated "monday,weekend" as [0,1,6]', function() {
			expect(parser.parseDay('monday,weekend')).to.eql([0,1,6]);
		});
	});
});