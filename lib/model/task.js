/** Class: Task
 * The <Task> object represents an start or shutdown action which an happen
 * on at least one recurrign day of the week.
 *
 * <Task>s are part of a <Schedule>.
 *
 * Constructor Options:
 *     (Array|Number) days - One or more day indices. See days.js
 *     (Time) time - A time-js Object representing a given time
 *     (String) action - The actual action which should be executed. Either
 *                       <Task.prototype.START> or <Task.prototype.SHUTDOWN>.
 */
var Task = function Task(options) {
	if(!options) {
		options = {};
	}
	if(options.days && !Array.isArray(options.days)) {
		options.days = [ options.days ];
	}

	this.days = options.days || [];
	this.time = options.time || undefined;
	this.action = options.action || undefined;
};

/** Function: toJSON
 * Returns a simplified version of this <Task>, ready to be transformed into a
 * JSON string.
 *
 * Returns:
 *     (Object)
 */
Task.prototype.toJSON = function toJSON() {
	return {
		days: this.days
		, time: this.time.toString()
		, action: this.action
	};
};

/** Constant: prototype.SHUTDOWN
 * Used for the `action` property of a <Task>. Value is `shutdown` as a String.
 */
Task.prototype.SHUTDOWN = 'shutdown';

/** Constant: prototype.START
 * Used for the `action` property of a <Task>. Value is `start` as a String.
 */
Task.prototype.START = 'start';

module.exports = Task;