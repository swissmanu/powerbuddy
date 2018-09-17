/** File: DefaultSystemAdapter
 * The <DefaultSystemAdapter> uses the tool adapters <at>, <cron> and <rtc> to
 * schedule shutdowns and starts for a Ubuntu-alike systems.
 *
 * Implement your own adapters if you need other tools to schedule actions to
 * your system.
 */

var q = require('q'),
  at = require('../tooladapter/at'),
  cron = require('../tooladapter/cron'),
  rtc = require('../tooladapter/rtc'),
  Task = require('../model/task');

/** Function: enable
 *
 * Parameters:
 *     (Schedule) schedule - The schedule to enable on the system
 *     (Boolean) simulate - Optional. If passed as true, no changes are written
 *                          to the system. Default is false.
 */
function enable(schedule, simulate) {
  var today = new Date(),
    nextShutdown = schedule.getNextUpcomingTask(today, Task.SHUTDOWN),
    nextStart = schedule.getNextUpcomingTask(today, Task.START),
    atIds = schedule.get('atIds');

  return q
    .all([
      at.unregister(atIds, simulate),
      cron.register(simulate),
      at.register(nextShutdown, simulate),
      rtc.register(nextStart, simulate)
    ])
    .then(function(results) {
      var atIds = schedule.get('atIds');

      if (Array.isArray(atIds)) {
        atIds.push(results[2]);
      } else {
        atIds = [results[2]];
      }

      if (!simulate) {
        schedule.set('atIds', atIds);
      }
    });
}

/** Function: disable
 *
 * Parameters:
 *     (Schedule) schedule - The schedule to disable on the system
 *     (Boolean) simulate - Optional. If passed as true, no changes are written
 *                          to the system. Default is false.
 */
function disable(schedule, simulate) {
  var atIds = schedule.get('atIds');

  return q.all([cron.unregister(simulate), at.unregister(atIds, simulate), rtc.unregister(simulate)]).then(function() {
    if (!simulate) {
      schedule.set('atIds', []);
    }
  });
}

module.exports = {
  enable: enable,
  disable: disable
};
