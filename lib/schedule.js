var fs = require('fs')
	, path = require('path')
	, Task = require('./task')
	, Time = require('time-js');


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
	if(!options) {
		options = {};
	}

	this.file = options.file || path.join('~', '.powerbuddy');
	this.tasks = options.tasks || [];
};

/** Function: getNextUpcomingTask
 * Returns the next upcoming <Task>, beginning from the `today` parameter.
 *
 * Parameters:
 *     (Date) today - Date object from which the next upcoming <Task> is
 *                          returned.
 *
 * Returns:
 *     (<Task>) or `undefined`
 */
Schedule.prototype.getNextUpcomingTask = function getNextUpcomingTask(today) {
	var sheet = this.getScheduleSheet(7, today)
		, sheetDays = Object.keys(sheet)
		, date = new Date(
			today.getFullYear()
			, today.getMonth()
			, today.getDate())
		, task
		, taskSearcher = function taskSearcher(candidate) {
			if(candidate.date > today) {
				task = candidate.task;
				return true;
			} else {
				return false;
			}
		};

	do {
		if(sheetDays.indexOf(date.toString()) !== -1) {
			var tasksForDay = sheet[date]
				, found = false;

			if(tasksForDay) {
				found = tasksForDay.some(taskSearcher);
			}

			if(!found) {
				// Nothing found at this time. Advance to the future and rerun
				// the loop since task is `undefined`.
				date.setDate(date.getDate()+1);
			}
		} else {
			// Something went wrong during the sheet creation or we have an
			// empty schedule. getNextUpcomingTask will return undefined
			// therefore.
			break;
		}
	} while(!task);

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
Schedule.prototype.getScheduleSheet =
	function getScheduleSheet(dayRange, today) {

	dayRange = dayRange || 7;
	today = today || new Date();

	var sheet = {}
		, firstDate = new Date(
			today.getFullYear()
			, today.getMonth()
			, today.getDate() - dayRange)
		, tasksGroupedByDay = this.getTasksGroupedByDay()
		, enrichTask = function enrichTask(task) {
			return {
				date: task.time.nextDate(date)
				, task: task
			};
		}
		, taskComparator = function taskComparator(a, b) {
			return a.date - b.date;
		};

	for(var i = 0, l = (dayRange*2); i <= l; i++) {
		var date = new Date(
				firstDate.getFullYear()
				, firstDate.getMonth()
				, firstDate.getDate() + i)
			, dayOfWeek = date.getDay()
			, tasks = tasksGroupedByDay[dayOfWeek];

		if(tasks) {
			// Enrich each task with a date property reflecting the actual date
			// where the task occurs.
			tasks = tasks.map(enrichTask);
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
			if(groups[day]) {
				groups[day].push(task);
			} else {
				groups[day] = [task];
			}
		});
	});

	return groups;
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

	return { tasks: jsonTasks };
};

/** Function: load
 * Loads a persistet <Schedule> in the file which path is available in the
 * file property of <Schedule>.
 *
 * Parameters:
 *     (Function) callback - Function called after finishing loading.
 */
Schedule.prototype.load = function load(callback) {
	var self = this
		, loadCallback = callback || function() {};

	fs.readFile(this.file, { encoding: 'utf-8' }, function(err, data) {
		if(!err) {
			var deserialized;
			self.tasks = [];

			try {
				deserialized = JSON.parse(data);
				deserialized.tasks.forEach(function(task) {
					self.tasks.push(new Task({
						days: task.days
						, startTime: new Time(task.startTime)
						, shutdownTime: new Time(task.shutdownTime)
					}));
				});
			} catch(e) {
				err = e;
			}
		}

		loadCallback(err, self);
	});
};

/** Function: save
 * Saves this <Schedule> into the file with the path as described in the
 * <Schedule>s file property.
 *
 * Parameter:
 *     (Function) callback - Function called after successfully saving
 */
Schedule.prototype.save = function save(callback) {
	var prepared = this.toJSON()
		, json = JSON.stringify(prepared)
		, writeCallback = callback || function() {};

	fs.writeFile(this.file, json, { encoding: 'utf-8' }, writeCallback);
};

module.exports = Schedule;