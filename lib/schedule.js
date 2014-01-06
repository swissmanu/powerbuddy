var fs = require('fs')
	, path = require('path')
	, Task = require('./task')
	, Time = require('time-js');


/** Class: Schedule
 * Contains a set of <Task>'s and provides access to them. If the next upcoming
 * <Task> from a given <Date> is needed, use the <nextTask> function.
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

/** Function: nextTask
 * Returns the next upcoming <Task>, beginning from the `currentDate` parameter.
 *
 * Parameters:
 *     (Date) currentDate - Date object from which the next upcoming <Task> is
 *                          returned.
 *
 * Returns:
 *     (<Task>) or `undefined`
 */
Schedule.prototype.nextTask = function nextTask(currentDate) {
	var possibleTasks
		, task;

	// Pre-filter only tasks which are related to the current day of week:
	possibleTasks = this.tasks.filter(function(task) {
		return (task.time.nextDate(currentDate) > currentDate);
	});

	if(possibleTasks.length > 0) {
		// Sort tasks regarding their upcoming date:
		possibleTasks.sort(function(a, b) {
			var dateA = a.time.nextDate(currentDate)
				, dateB = b.time.nextDate(currentDate);

			return dateA - dateB; // the default number-compare-hack :)
		});

		// Get first upcoming task
		task = possibleTasks[0];
	}

	return task;
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