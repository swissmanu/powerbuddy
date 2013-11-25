/* global describe, it, expect, before, after */
describe('Schedule', function() {
	var Schedule = require('../../lib/schedule')
		, path = require('path')
		, fs = require('fs')
		, scheduleFileDir = 'tmp'
		, scheduleFilePath = path.join(scheduleFileDir, 'fancypowerbuddy.json');

	before(function() {
		if(!fs.existsSync(scheduleFileDir)) {
			fs.mkdirSync(scheduleFileDir);
		}
	});

	after(function() {
		fs.unlinkSync(scheduleFilePath);
		fs.rmdirSync(scheduleFileDir);
	});


	describe('file property', function() {
		it('should use ~/.powerbuddy by default', function() {
			var testSchedule = new Schedule()
				, homeDir = path.join('~', '.powerbuddy');

			expect(testSchedule.file).to.be.eql(homeDir);
		});

		it('should use the file passed with an options object', function() {
			var testSchedule = new Schedule({ file: scheduleFilePath });
			expect(testSchedule.file).to.be.eql(scheduleFilePath);
		});
	});

	describe('load', function() {
		it('should load specified file', function() {
			var testSchedule = new Schedule({file: scheduleFilePath});
		});
	});

	describe('save', function() {
		it('should create specified file', function() {
			var testSchedule = new Schedule({file: scheduleFilePath});
			testSchedule.save();

			expect(fs.existsSync(scheduleFilePath)).to.be(true);
		});
	});

});