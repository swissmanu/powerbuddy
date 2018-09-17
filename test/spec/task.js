describe('Task', () => {
  var Task = require('../../lib/model/task'),
    fakeFactory = require('../lib/fakeFactory'),
    days = require('../../lib/model/days'),
    Time = require('time-js');

  it('should take an array of day indices with its constructor options argument', () => {
    var weekdays = days.weekdays,
      testTask = new Task({ days: weekdays });
    expect(testTask.days).toEqual(weekdays);
  });

  it('should convert a single day index to an array when passed to the constructor', () => {
    var monday = days.monday,
      testTask = new Task({ days: monday });

    expect(testTask.days).toBeInstanceOf(Array);
    expect(testTask.days[0]).toEqual(monday);
  });

  it('should take a time with its constructor options argument', () => {
    var time = new Time(),
      testTask = new Task({ time: time });

    expect(testTask.time.toString()).toEqual(time.toString());
  });

  it('should take an action with its constructor options argument', () => {
    var action = Task.prototype.SHUTDOWN,
      testTask = new Task({ action: action });

    expect(testTask.action).toEqual(action);
  });

  describe('toJSON', () => {
    it('should return the tasks information in a simplified object, ready to be stringified', () => {
      var weekdays = days.weekdays,
        time = new Time(),
        action = Task.prototype.SHUTDOWN,
        testTask = fakeFactory.createTask(weekdays, time, action),
        expected = {
          days: weekdays,
          time: time.toString(),
          action: action
        };

      expect(testTask.toJSON()).toEqual(expected);
    });
  });
});
