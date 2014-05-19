var q = require('q')
	, crontab = require('crontab');

/** Function: register
 * Schedules a cronjob that is automatically executes `powerbuddy enable` each
 * time the machine boots.
 *
 * This way, the next upcoming shutdown and start task is scheduled.
 *
 * Returns:
 *     (Promise)
 */
function register() {
	var deferred = q.defer();

	crontab.load(function(err, tab) {
		if(err) {
			deferred.reject(err);
		} else {
			var job = tab.findComment('PowerBuddy');

			if(job.length === 0) {
				job = tab.create('powerbuddy enable');
				job.everyReboot();
				job.comment('PowerBuddy');

				tab.save(function(err) {
					if(err) {
						q.reject(err);
					} else {
						q.resolve();
					}
				});
			}
		}

		return deferred.promise;
	});
}

/** Function: unregister
 * Deletes a potentially scheduled cronjob that ensures the execution of
 * `powerbuddy enable`.
 *
 * Returns:
 *     (Promise)
 */
function unregister() {
	var deferred = q.defer();

	crontab.load(function(err, tab) {
		var jobs = tab.findComment('PowerBuddy');

		jobs.forEach(function(job) {
			tab.remove(job);
		});

		tab.save(function(err) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
	});

	return deferred.promise;
}

module.exports = {
	register: register
	, unregister: unregister
};