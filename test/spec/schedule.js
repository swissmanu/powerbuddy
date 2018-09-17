import Schedule from '../../lib/model/schedule';
import Task from '../../lib/model/task';
import days from '../../lib/model/days';
import Time from 'time-js';
import path from 'path';
import fs from 'fs';
import fakeFactory from '../lib/fakeFactory.js';

describe('Schedule', () => {
  const scheduleFileDir = 'tmp';
  const scheduleFilePath = path.join(scheduleFileDir, 'fancypowerbuddy.json');

  beforeEach(() => {
    if (!fs.existsSync(scheduleFileDir)) {
      fs.mkdirSync(scheduleFileDir);
    }
  });

  afterEach(() => {
    fs.unlinkSync(scheduleFilePath);
    fs.rmdirSync(scheduleFileDir);
  });

  describe('tasks property', () => {
    it('should be an array', () => {
      var testSchedule = new Schedule();
      expect(testSchedule.tasks).to.be.a('array');
    });
  });

  describe('file property', () => {
    it('should use ~/.powerbuddy by default', () => {
      var testSchedule = new Schedule(),
        usersHome = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'],
        homeDir = path.join(usersHome, '.powerbuddy');

      expect(testSchedule.file).to.be.eql(homeDir);
    });

    it('should use the file passed with an options object', () => {
      var testSchedule = new Schedule({ file: scheduleFilePath });
      expect(testSchedule.file).to.be.eql(scheduleFilePath);
    });
  });

  describe('getNextUpcomingTask', () => {
    var shutdownMondayNoon = new Task({
        days: days.monday,
        time: new Time('12 pm'),
        action: Task.prototype.SHUTDOWN
      }),
      startMonday3PM = new Task({
        days: days.monday,
        time: new Time('3 pm'),
        action: Task.prototype.START
      }),
      schedule = new Schedule({
        tasks: [startMonday3PM, shutdownMondayNoon]
      });

    it('should return the shutdown task when called at 11 am on monday', () => {
      var monday11AM = new Date(2014, 0, 6, 11),
        nextTask = schedule.getNextUpcomingTask(monday11AM);

      expect(nextTask.date).to.be.eql(new Date(2014, 0, 6, 12));
      expect(nextTask.task).to.be.eql(shutdownMondayNoon);
    });

    it('should return the start task when called at 12 pm on monday', () => {
      var monday1PM = new Date(2014, 0, 6, 12),
        nextTask = schedule.getNextUpcomingTask(monday1PM);

      expect(nextTask.date).to.be.eql(new Date(2014, 0, 6, 15));
      expect(nextTask.task).to.be.eql(startMonday3PM);
    });

    it('should return the shutdown task when called at 8pm on sunday', () => {
      var sunday8PM = new Date(2014, 0, 5, 20),
        nextTask = schedule.getNextUpcomingTask(sunday8PM);

      expect(nextTask.date).to.be.eql(new Date(2014, 0, 6, 12));
      expect(nextTask.task).to.be.eql(shutdownMondayNoon);
    });

    it('should return the shutdown task from next week when called at 4pm on monday', () => {
      var monday4PM = new Date(2014, 0, 6, 16),
        nextTask = schedule.getNextUpcomingTask(monday4PM);

      expect(nextTask.date).to.be.eql(new Date(2014, 0, 13, 12));
      expect(nextTask.task).to.be.eql(shutdownMondayNoon);
    });

    it('should return the shutdown task when asking only for shutdowns', () => {
      var nextTask = schedule.getNextUpcomingTask(new Date(), Task.prototype.SHUTDOWN);

      expect(nextTask.date).not.to.be(undefined);
      expect(nextTask.task).to.be.eql(shutdownMondayNoon);
    });

    it('should return the start task when asking only for starts', () => {
      var nextTask = schedule.getNextUpcomingTask(new Date(), Task.prototype.START);

      expect(nextTask.date).not.to.be(undefined);
      expect(nextTask.task).to.be.eql(startMonday3PM);
    });

    it('should use a default value if the today parameter is not passed', () => {
      expect(() => {
        schedule.getNextUpcomingTask();
      }).to.not.throwError();
    });

    it('should return undefined if schedule is empty', () => {
      schedule.tasks = [];
      expect(schedule.getNextUpcomingTask()).to.be(undefined);
    });
  });

  describe('getScheduleSheet', () => {
    var shutdownMondayNoon = new Task({
        days: days.monday,
        time: new Time('12 pm'),
        action: Task.prototype.SHUTDOWN
      }),
      startMonday3PM = new Task({
        days: days.monday,
        time: new Time('3 pm'),
        action: Task.prototype.START
      }),
      schedule = new Schedule({
        tasks: [startMonday3PM, shutdownMondayNoon]
      });

    it('should use a default day range of 7 (finishing into a sheet of 15 days) if no range is defined', () => {
      var sheet = schedule.getScheduleSheet(),
        totalDays = 15;

      expect(Object.keys(sheet).length).to.be.equal(totalDays);
    });

    it('should create a schedule sheet ranging from/to specified number of days in past/future', () => {
      var dayRange = 9,
        totalDays = dayRange * 2 + 1,
        sheet = schedule.getScheduleSheet(dayRange);

      expect(Object.keys(sheet).length).to.be.equal(totalDays);
    });

    it('should contain expected days and tasks in ascending order', () => {
      var dayRange = 6,
        currentDate = new Date(2014, 0, 6),
        firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - dayRange),
        sheet = schedule.getScheduleSheet(dayRange, currentDate),
        days = [];

      for (var i = 0, l = dayRange * 2; i <= l; i++) {
        days.push(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i).toString());
      }

      expect(Object.keys(sheet)).to.eql(days);
      expect(sheet[currentDate][0].task).to.be.eql(shutdownMondayNoon);
      expect(sheet[currentDate][1].task).to.be.eql(startMonday3PM);
    });
  });

  describe('getTasksGroupedByDay', () => {
    var shutdownMondayNoon = new Task({
        days: days.monday,
        time: new Time('12 pm'),
        action: Task.prototype.SHUTDOWN
      }),
      startMonday3PM = new Task({
        days: days.monday,
        time: new Time('3 pm'),
        action: Task.prototype.START
      }),
      schedule = new Schedule({
        tasks: [startMonday3PM, shutdownMondayNoon]
      });

    it('should return an object, containing a member for each with the respective day tasks', () => {
      var tasksGroupedByDay = schedule.getTasksGroupedByDay();

      expect(Object.keys(tasksGroupedByDay).length).to.be.equal(1);
      expect(tasksGroupedByDay[days.monday]).to.contain(shutdownMondayNoon);
      expect(tasksGroupedByDay[days.monday]).to.contain(startMonday3PM);
    });
  });

  describe('set & get', () => {
    var schedule = new Schedule();

    it('should work as key/value store', () => {
      var key = 'foo',
        value = 'bar';

      schedule.set(key, value);
      expect(schedule.get(key)).to.equal(value);
    });
  });

  describe('toJSON', () => {
    it('should return a simplified vesion of the schedule, ready to be stringified', () => {
      var testSchedule = fakeFactory.createSchedule(),
        expected = { tasks: [], settings: {} };

      testSchedule.tasks.forEach(function(task) {
        expected.tasks.push(task.toJSON());
      });

      expect(testSchedule.toJSON()).to.be.eql(expected);
    });
  });

  describe('save', () => {
    it('should create specified file', function(done) {
      var testSchedule = new Schedule({ file: scheduleFilePath });

      testSchedule.save().then(() => {
        expect(fs.existsSync(scheduleFilePath)).to.be(true);
        done();
      });
    });

    it('should contain the serialized schedule', function(done) {
      var testSchedule = fakeFactory.createSchedule();
      testSchedule.file = scheduleFilePath;

      testSchedule.save().then(() => {
        var fileContent = fs.readFileSync(scheduleFilePath, { encoding: 'utf-8' }),
          json = JSON.stringify(testSchedule.toJSON());

        expect(fileContent).to.be.equal(json);
        done();
      });
    });
  });

  describe('load', () => {
    it('should load specified file', function(done) {
      var savedSchedule = fakeFactory.createSchedule(),
        loadedSchedule;
      savedSchedule.file = scheduleFilePath;

      savedSchedule
        .save()
        .then(() => {
          loadedSchedule = new Schedule({ file: scheduleFilePath });
          return loadedSchedule.load();
        })
        .then(function(schedule) {
          expect(schedule.tasks.length).to.be.equal(savedSchedule.tasks.length);
          done();
        });
    });
  });
});
