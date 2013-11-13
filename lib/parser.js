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
		everyday: [0, 1, 2, 3, 4, 5, 6]
		, weekdays: [1, 2, 3, 4, 5]
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
	var rawDays = [raw]
		, parsedDays = [];

	// Comma separated days?
	if(raw.indexOf(',') !== -1) {
		rawDays = raw.split(',');
	}

	// Process each raw day:
	rawDays.forEach(function(rawDay) {
		var index = days.indexOf(rawDay)
			, parsed = [];

		if(index === -1) {
			if(dayRanges[rawDay]) {
				parsed = dayRanges[rawDay];
			}
		} else {
			parsed.push(index);
		}

		parsedDays = parsedDays.concat(parsed);
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