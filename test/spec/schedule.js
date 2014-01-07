/* global describe, it, expect, before, after */
describe('Schedule', function() {
	var Schedule = require('../../lib/schedule')
		, Task = require('../../lib/task')
		, days = require('../../lib/days')
		, Time = require('time-js')
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



	describe('nextTask', function() {
		var shutdownMondayNoon = new Task({
				days: days.monday
				, time: new Time('12 pm')
				, action: Task.prototype.SHUTDOWN
			})
			, startMonday3PM = new Task({
				days: days.monday
					, time: new Time('3 pm')
					, action: Task.prototype.START
				})
			, schedule = new Schedule({
				tasks: [ startMonday3PM, shutdownMondayNoon ]
			});

		it('should return the shutdown task when called at 11 am on monday', function() {
			var monday11AM = new Date(2014, 0, 6, 11)
				, nextTask = schedule.nextTask(monday11AM);

			expect(nextTask).to.be.eql(shutdownMondayNoon);
		});

		it('should return the start task when called at 1 pm on monday', function() {
			var monday1PM = new Date(2014, 0, 6, 13)
				, nextTask = schedule.nextTask(monday1PM);

			expect(nextTask).to.be.eql(startMonday3PM);
		});

		/*
		it('should return the shutdown task when called at 8pm on sunday', function() {
			var sunday8PM = new Date(2014, 0, 5, 20)
				, nextTask = schedule.nextTask(sunday8PM);

			expect(nextTask).to.be.eql(shutdownMondayNoon);
		});
		*/

	});


	describe('getScheduleSheet', function() {
		var shutdownMondayNoon = new Task({
				days: days.monday
				, time: new Time('12 pm')
				, action: Task.prototype.SHUTDOWN
			})
			, startMonday3PM = new Task({
				days: days.monday
					, time: new Time('3 pm')
					, action: Task.prototype.START
				})
			, schedule = new Schedule({
				tasks: [ startMonday3PM, shutdownMondayNoon ]
			});

		it('should use a default day range of 6 (finishing into a sheet of 13 days) if no range is defined', function() {
			var sheet = schedule.getScheduleSheet()
				, totalDays = 13;

			expect(Object.keys(sheet).length).to.be.equal(totalDays);
		});

		it('should create a schedule sheet ranging from/to specified number of days in past/future', function() {
			var dayRange = 9
				, totalDays = (dayRange * 2) + 1
				, sheet = schedule.getScheduleSheet(dayRange);

			expect(Object.keys(sheet).length).to.be.equal(totalDays);
		});

		it('should contain expected days and tasks', function() {
			var dayRange = 6
				, currentDate = new Date(2014, 0, 6)
				, firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - dayRange)
				, sheet = schedule.getScheduleSheet(dayRange, currentDate)
				, days = [];


			for(var i = 0, l = dayRange*2; i <= l; i++) {
				days.push(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i).toString());
			}

			expect(Object.keys(sheet)).to.eql(days);
			expect(sheet['Mon Jan 06 2014 00:00:00 GMT+0100 (CET)'][0].task).to.be.eql(shutdownMondayNoon);
			expect(sheet['Mon Jan 06 2014 00:00:00 GMT+0100 (CET)'][1].task).to.be.eql(startMonday3PM);
		});
	});


	describe('getTasksGroupedByDay', function() {
		var shutdownMondayNoon = new Task({
				days: days.monday
				, time: new Time('12 pm')
				, action: Task.prototype.SHUTDOWN
			})
			, startMonday3PM = new Task({
				days: days.monday
					, time: new Time('3 pm')
					, action: Task.prototype.START
				})
			, schedule = new Schedule({
				tasks: [ startMonday3PM, shutdownMondayNoon ]
			});

		it('should return an object, containing a member for each with the respective day tasks', function() {
			var tasksGroupedByDay = schedule.getTasksGroupedByDay();

			expect(Object.keys(tasksGroupedByDay).length).to.be.equal(1);
			expect(tasksGroupedByDay[days.monday]).to.contain(shutdownMondayNoon);
			expect(tasksGroupedByDay[days.monday]).to.contain(startMonday3PM);
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