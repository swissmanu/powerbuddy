/* global describe, it, expect, before, after */
describe('Schedule', function() {
	var Schedule = require('../../lib/schedule')
		, path = require('path')
		, fs = require('fs')
		, scheduleFileDir = 'tmp'
		, scheduleFilePath = path.join(scheduleFileDir, 'fancypowerbuddy.json')
		, fakeFactory = require('../lib/fakeFactory.js');


	before(function() {
		if(!fs.existsSync(scheduleFileDir)) {
			fs.mkdirSync(scheduleFileDir);
		}
	});

	after(function() {
		fs.unlinkSync(scheduleFilePath);
		fs.rmdirSync(scheduleFileDir);
	});

	describe('tasks property', function() {
		it('should be an array', function() {
			var testSchedule = new Schedule();
			expect(testSchedule.tasks).to.be.a('array');
		});
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

	describe('toJSON', function() {
		it('should return a simplified vesion of the schedule, ready to be stringified', function() {
			var testSchedule = fakeFactory.createSchedule()
				, expected = { tasks: [] };

			testSchedule.tasks.forEach(function(task) {
				expected.tasks.push(task.toJSON());
			});

			expect(testSchedule.toJSON()).to.be.eql(expected);
		});
	});

	describe('save', function() {
		it('should create specified file', function(done) {
			var testSchedule = new Schedule({file: scheduleFilePath});

			testSchedule.save(function(err) {
				expect(err).to.be.undefined;
				expect(fs.existsSync(scheduleFilePath)).to.be(true);
				done();
			});
		});

		it('should contain the serialized schedule', function(done) {
			var testSchedule = fakeFactory.createSchedule();
			testSchedule.file = scheduleFilePath;

			testSchedule.save(function(err) {
				expect(err).to.be.undefined;

				var fileContent = fs.readFileSync(scheduleFilePath, { encoding: 'utf-8' })
					, json = JSON.stringify(testSchedule.toJSON());

				expect(fileContent).to.be.equal(json);
				done();
			});
		});
	});

	describe('load', function() {
		it('should load specified file', function(done) {
			var savedSchedule = fakeFactory.createSchedule();
			savedSchedule.file = scheduleFilePath;

			savedSchedule.save(function(err) {
				expect(err).to.be.undefined;

				var loadedSchedule = new Schedule({ file: scheduleFilePath });

				loadedSchedule.load(function(err, schedule) {
					expect(err).to.be.undefined;

					// Bad test, but working for the moment
					expect(schedule.tasks.length).to.be.equal(savedSchedule.tasks.length);
					done();
				});
			});

		});
	});

});