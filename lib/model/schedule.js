var debug = require('debug')('powerbuddy:model:schedule'),
  fs = require('fs'),
  path = require('path'),
  Task = require('./task'),
  Time = require('time-js'),
  q = require('q');

/** Class: Schedule
 * Contains a set of <Task>'s and provides access to them. If the next upcoming
 * <Task> from a given <Date> is needed, use the <getNextUpcomingTask> function.
 *
 * To persist the <Schedule>, <save> and <load> functions are your friend. They
 * use the file property to write and read.
 *
 * Constructor options:
 *     (String) file - File path to persist the <Schedule>. Optional. Default is
 *                     ~/.powerbuddy
 *     (Array) tasks - An array with <Task>s. Optional. Default is an empty
 *                     array.
 */
var Schedule = function Schedule(options) {
  if (!options) {
    options = {};
  }

  var usersHome = this.getUsersHome();

  this.file = options.file || path.join(usersHome, '.powerbuddy');
  this.tasks = options.tasks || [];
  this.settings = options.settings || {};
};

/** Function: getNextUpcomingTask
 * Returns the next upcoming <Task>, beginning from the `today` parameter.
 *
 * Parameters:
 *     (Date) today - Date from which the next upcoming <Task> is returned.
 *                    Optional. Default is the current date.
 *     (String) action - Only return a <Task> with this action. Optional. By
 *                       default, it does not matter what kind of action is
 *                       defined. See <Task.START> and <Task.SHUTDOWN> for
 *                       possible values.
 *
 * Returns:
 *     An (Object) containing a <Date> and a <Task>. The `date` represents
 *     the next occurance of the task. `undefined` if no task was found.
 *
 *     { date: Date(), task: { ... } }
 */
Schedule.prototype.getNextUpcomingTask = function getNextUpcomingTask(today, action) {
  if (!today) {
    today = new Date();
  }

  const sheet = this.getScheduleSheet(7, today);
  const sheetDays = Object.keys(sheet);
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const actionFilter = function actionFilter(task) {
    return action === undefined || task.action === action;
  };
  const taskSearcher = function taskSearcher(candidate) {
    if (candidate.date > today && actionFilter(candidate.task)) {
      task = candidate;
      return true;
    } else {
      return false;
    }
  };
  let task;

  do {
    if (sheetDays.indexOf(date.toString()) !== -1) {
      var tasksForDay = sheet[date],
        found = false;

      if (tasksForDay) {
        found = tasksForDay.some(taskSearcher);
      }

      if (!found) {
        // Nothing found at this time. Advance 1 day to the future and
        // rerun the loop since task is `undefined`.
        date.setDate(date.getDate() + 1);
      }
    } else {
      // Something went wrong during the sheet creation or we have an
      // empty schedule. getNextUpcomingTask will return undefined
      // therefore.
      break;
    }
  } while (!task);

  return task;
};

/** Function: getScheduleSheet
 * Returns an object containing a specified amount of days before and after
 * `today` as keys. The regarding values contain an array of <Task>s happening
 * on that particular day.
 *
 * Parameters:
 *     (Number) dayRange - Amount of days to return before and after `today`.
 *                         Optional. Default is `6`.
 *     (Date) today - The date object representing the day of interest.
 *                    Optional. Default is the current date (as of
 *                    `new Date()`).
 *
 * Returns:
 *     (Object)
 */
Schedule.prototype.getScheduleSheet = function getScheduleSheet(dayRange, today) {
  dayRange = dayRange || 7;
  today = today || new Date();

  const sheet = {};
  const firstDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayRange);
  const tasksGroupedByDay = this.getTasksGroupedByDay();
  const enrichTask = function enrichTask(task) {
    return {
      date: task.time.nextDate(this.date),
      task: task
    };
  };
  const taskComparator = function taskComparator(a, b) {
    return a.date - b.date;
  };

  for (let i = 0, l = dayRange * 2; i <= l; i++) {
    const date = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i);
    const dayOfWeek = date.getDay();
    let tasks = tasksGroupedByDay[dayOfWeek];

    if (tasks) {
      // Enrich each task with a date property reflecting the actual date
      // where the task occurs & sort.
      tasks = tasks.map(enrichTask, { date: date });
      tasks.sort(taskComparator);
    }

    sheet[date] = tasks;
  }

  return sheet;
};

/** Function: getTasksGroupedByDay
 * Returns an object containing all <Task>s of this <Schedule> grouped by the
 * day of occurence.
 * The returned object uses the day number as key, whereas the specific value
 * is an array containing the tasks.
 *
 * This is a relativliy expensive function since it contains kind of many loops.
 * Use it with care :)
 *
 * Returns:
 *     (Object)
 */
Schedule.prototype.getTasksGroupedByDay = function getTasksGroupedByDay() {
  var groups = {};

  this.tasks.forEach(function(task) {
    task.days.forEach(function(day) {
      if (groups[day]) {
        groups[day].push(task);
      } else {
        groups[day] = [task];
      }
    });
  });

  return groups;
};

Schedule.prototype.getUsersHome = function getUsersHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

Schedule.prototype.get = function get(key) {
  return this.settings[key];
};

Schedule.prototype.set = function set(key, value) {
  this.settings[key] = value;
};

/** Function: toJSON
 * Returns an object containing all information of this <Schedule>. The
 * contained information is simplified down to a level which allows to serialize
 * it into a JSON string.
 *
 * Returns:
 *     (Object)
 */
Schedule.prototype.toJSON = function toJSON() {
  var jsonTasks = [];

  this.tasks.forEach(function(task) {
    jsonTasks.push(task.toJSON());
  });

  return {
    tasks: jsonTasks,
    settings: this.settings || {}
  };
};

/** Function: load
 * Loads a persisted <Schedule> in the file which path is available in the
 * file property of <Schedule>.
 * If the file which backs the <Schedule> is not available, there is no error
 * exposed. You will get an empty <Schedule> to work with.
 *
 * Returns:
 *     (Promise)
 */
Schedule.prototype.load = function load() {
  debug('load');

  var self = this;

  self.tasks = [];
  self.settings = {};

  return q
    .nfcall(fs.readFile, this.file, { encoding: 'utf-8' })
    .then(function(data) {
      debug('found ' + self.file + '. populate schedule.');

      var deserialized = JSON.parse(data);
      self.settings = deserialized.settings || {};

      if (Array.isArray(deserialized.tasks)) {
        deserialized.tasks.forEach(function(task) {
          self.tasks.push(
            new Task({
              days: task.days,
              time: new Time(task.time),
              action: task.action
            })
          );
        });
      }

      return self;
    })
    .fail(function() {
      debug('did not found ' + self.file + '. working with an empty schedule.');
      return self;
    });
};

/** Function: save
 * Saves this <Schedule> into the file with the path as described in the
 * <Schedule>s file property.
 *
 * Parameter:
 *     (Function) callback - Function called after successfully saving
 */
Schedule.prototype.save = function save() {
  debug('save');

  const json = JSON.stringify(this.toJSON());

  return new Promise((resolve, reject) =>
    fs.writeFile(this.file, json, { encoding: 'utf-8' }, err => {
      if (err) {
        reject(err);
      }
      resolve();
    })
  );
};

module.exports = Schedule;
