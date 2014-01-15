var time = require('time-js')
	, days = require('./model/days')
	, daysByName = Object.keys(days);

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
	var rawDays = [raw]
		, parsedDays = [];

	// Comma separated days?
	if(raw.indexOf(',') !== -1) {
		rawDays = raw.split(',');
	}

	// Process each raw day:
	rawDays.forEach(function(rawDay) {
		var index = daysByName.indexOf(rawDay);

		if(index !== -1) {
			var parsedDay = days[daysByName[index]];
			if(Array.isArray(parsedDay)) {
				parsedDays = parsedDays.concat(parsedDay);
			} else {
				parsedDays.push(parsedDay);
			}
		}
	});

	// Remove duplicates:
	parsedDays = parsedDays.filter(function(parsedDay, index) {
		return (parsedDays.indexOf(parsedDay) === index);
	});

	return parsedDays.sort();
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