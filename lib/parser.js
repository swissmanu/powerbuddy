var time = require('time-js')
	, days = [
		'sunday'
		, 'monday'
		, 'tuesday'
		, 'wednesday'
		, 'thursday'
		, 'friday'
		, 'saturday'

	]
	, dayRanges = {
		weekday: [1, 2, 3, 4, 5]
		, weekend: [0, 6]
	};

/** Function: parseDay
 * Parses a raw day string and returns an array with matching day indices.
 *
 * Parameters:
 *     (String) raw - Raw day string (monday, weekday etc.)
 *
 * Returns:
 *     (Array) containing indices of parsed day. Empty of parsing failed.
 */
function parseDay(raw) {
	raw = raw.toLowerCase();

	var parsedDays = days.indexOf(raw);

	if(parsedDays === -1) {
		if(dayRanges[raw]) {
			parsedDays = dayRanges[raw];
		}
	} else {
		parsedDays = [parsedDays];
	}

	return parsedDays;
}

/** Function: parseTime
 * Parses a raw time string and returns a Time object.
 *
 * Parameters:
 *     (String) raw - Raw time string (11pm, 1am etc.)
 *
 * Returns:
 *     (Time) a time-js Time object
 */
function parseTime(raw) {
	var parsedTime = time(raw);

	return parsedTime;
}


module.exports = {
	parseDay: parseDay
	, parseTime: parseTime
};