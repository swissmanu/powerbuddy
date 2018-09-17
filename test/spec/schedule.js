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
    if (fs.existsSync(scheduleFilePath)) {
      fs.unlinkSync(scheduleFilePath);
    }
    if (fs.existsSync(scheduleFileDir)) {
      fs.rmdirSync(scheduleFileDir);
    }
  });

  describe('tasks property', () => {
    it('should be an array', () => {
      const testSchedule = new Schedule();
      expect(testSchedule.tasks).toBeInstanceOf(Array);
    });
  });

  describe('file property', () => {
    it('should use ~/.powerbuddy by default', () => {
      const testSchedule = new Schedule();
      const usersHome = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      const homeDir = path.join(usersHome, '.powerbuddy');

      expect(testSchedule.file).toEqual(homeDir);
    });

    it('should use the file passed with an options object', () => {
      const testSchedule = new Schedule({ file: scheduleFilePath });
      expect(testSchedule.file).toEqual(scheduleFilePath);
    });
  });

  describe('getNextUpcomingTask', () => {
    const shutdownMondayNoon = new Task({
      days: days.monday,
      time: new Time('12 pm'),
      action: Task.prototype.SHUTDOWN
    });
    const startMonday3PM = new Task({
      days: days.monday,
      time: new Time('3 pm'),
      action: Task.prototype.START
    });
    const schedule = new Schedule({
      tasks: [startMonday3PM, shutdownMondayNoon]
    });

    it('should return the shutdown task when called at 11 am on monday', () => {
      const monday11AM = new Date(2014, 0, 6, 11);
      const nextTask = schedule.getNextUpcomingTask(monday11AM);

      expect(nextTask.date).toBe(new Date(2014, 0, 6, 12));
      expect(nextTask.task).toBe(shutdownMondayNoon);
    });

    it('should return the start task when called at 12 pm on monday', () => {
      const monday1PM = new Date(2014, 0, 6, 12);
      const nextTask = schedule.getNextUpcomingTask(monday1PM);

      expect(nextTask.date).toEqual(new Date(2014, 0, 6, 15));
      expect(nextTask.task).toEqual(startMonday3PM);
    });

    it('should return the shutdown task when called at 8pm on sunday', () => {
      const sunday8PM = new Date(2014, 0, 5, 20);
      const nextTask = schedule.getNextUpcomingTask(sunday8PM);

      expect(nextTask.date).toEqual(new Date(2014, 0, 6, 12));
      expect(nextTask.task).toEqual(shutdownMondayNoon);
    });

    it('should return the shutdown task from next week when called at 4pm on monday', () => {
      const monday4PM = new Date(2014, 0, 6, 16);
      const nextTask = schedule.getNextUpcomingTask(monday4PM);

      expect(nextTask.date).toEqual(new Date(2014, 0, 13, 12));
      expect(nextTask.task).toEqual(shutdownMondayNoon);
    });

    it('should return the shutdown task when asking only for shutdowns', () => {
      const nextTask = schedule.getNextUpcomingTask(new Date(), Task.prototype.SHUTDOWN);

      expect(nextTask.date).not.to.be(undefined);
      expect(nextTask.task).toEqual(shutdownMondayNoon);
    });

    it('should return the start task when asking only for starts', () => {
      const nextTask = schedule.getNextUpcomingTask(new Date(), Task.prototype.START);

      expect(nextTask.date).not.to.be(undefined);
      expect(nextTask.task).toEqual(startMonday3PM);
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
    const shutdownMondayNoon = new Task({
      days: days.monday,
      time: new Time('12 pm'),
      action: Task.prototype.SHUTDOWN
    });
    const startMonday3PM = new Task({
      days: days.monday,
      time: new Time('3 pm'),
      action: Task.prototype.START
    });
    const schedule = new Schedule({
      tasks: [startMonday3PM, shutdownMondayNoon]
    });

    it('should use a default day range of 7 (finishing into a sheet of 15 days) if no range is defined', () => {
      const sheet = schedule.getScheduleSheet();
      const totalDays = 15;

      expect(Object.keys(sheet).length).toBe(totalDays);
    });

    it('should create a schedule sheet ranging from/to specified number of days in past/future', () => {
      const dayRange = 9;
      const totalDays = dayRange * 2 + 1;
      const sheet = schedule.getScheduleSheet(dayRange);

      expect(Object.keys(sheet).length).toBe(totalDays);
    });

    it('should contain expected days and tasks in ascending order', () => {
      const dayRange = 6;
      const currentDate = new Date(2014, 0, 6);
      const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - dayRange);
      const sheet = schedule.getScheduleSheet(dayRange, currentDate);
      const days = [];

      for (let i = 0, l = dayRange * 2; i <= l; i++) {
        days.push(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i).toString());
      }

      expect(Object.keys(sheet)).toEqual(days);
      expect(sheet[currentDate][0].task).toEqual(shutdownMondayNoon);
      expect(sheet[currentDate][1].task).toEqual(startMonday3PM);
    });
  });

  describe('getTasksGroupedByDay', () => {
    const shutdownMondayNoon = new Task({
      days: days.monday,
      time: new Time('12 pm'),
      action: Task.prototype.SHUTDOWN
    });
    const startMonday3PM = new Task({
      days: days.monday,
      time: new Time('3 pm'),
      action: Task.prototype.START
    });
    const schedule = new Schedule({
      tasks: [startMonday3PM, shutdownMondayNoon]
    });

    it('should return an object, containing a member for each with the respective day tasks', () => {
      const tasksGroupedByDay = schedule.getTasksGroupedByDay();

      expect(Object.keys(tasksGroupedByDay).length).toBe(1);
      expect(tasksGroupedByDay[days.monday]).toContain(shutdownMondayNoon);
      expect(tasksGroupedByDay[days.monday]).toContain(startMonday3PM);
    });
  });

  describe('set & get', () => {
    const schedule = new Schedule();

    it('should work as key/value store', () => {
      const key = 'foo';
      const value = 'bar';

      schedule.set(key, value);
      expect(schedule.get(key)).toBe(value);
    });
  });

  describe('toJSON', () => {
    it('should return a simplified vesion of the schedule, ready to be stringified', () => {
      const testSchedule = fakeFactory.createSchedule();
      const expected = { tasks: [], settings: {} };

      testSchedule.tasks.forEach(function(task) {
        expected.tasks.push(task.toJSON());
      });

      expect(testSchedule.toJSON()).toEqual(expected);
    });
  });

  describe('save', () => {
    it('should create specified file', async () => {
      const testSchedule = new Schedule({ file: scheduleFilePath });
      await testSchedule.save();
      expect(fs.existsSync(scheduleFilePath)).toBe(true);
    });

    it('should contain the serialized schedule', async () => {
      const testSchedule = fakeFactory.createSchedule();
      testSchedule.file = scheduleFilePath;

      await testSchedule.save();
      const fileContent = fs.readFileSync(scheduleFilePath, { encoding: 'utf-8' });
      const json = JSON.stringify(testSchedule.toJSON());
      expect(fileContent).toEqual(json);
    });
  });

  describe('load', () => {
    it('should load specified file', async () => {
      const savedSchedule = fakeFactory.createSchedule();
      savedSchedule.file = scheduleFilePath;

      await savedSchedule.save();
      const loadedSchedule = new Schedule({ file: scheduleFilePath });
      await loadedSchedule.load();
      expect(loadedSchedule.tasks.length).toBe(savedSchedule.tasks.length);
    });
  });
});
