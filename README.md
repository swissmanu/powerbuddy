# PowerBuddy
[![Build Status](https://travis-ci.org/swissmanu/powerbuddy.png?branch=master)](https://travis-ci.org/swissmanu/powerbuddy) [![Coverage Status](https://coveralls.io/repos/swissmanu/powerbuddy/badge.png)](https://coveralls.io/r/swissmanu/powerbuddy)

`powerbuddy` is a command line utility, written in JavaScript using Node.js and allows you to create exact schedules when to start and shutdown a unix based computer.

## Requirements

### Hardware

* Bios with support for scheduled system startups using `RTC`, aka *[real-time clock](https://www.linux.com/learn/docs/672849-wake-up-linux-with-an-rtc-alarm-clock)*

### Software

* nodejs
* Unix-based operating system, providing:
  * working `shutdown` system utilities for shutting down the system
  * working `at` system utilities for scheduling jobs
  * enabled `rtc` kernel module for scheduling automated system startups


## Manage a Schedule


## How PowerBuddy works
After setting up a schedule, `powerbuddy` looks for the next upcoming shutdown task.
At the tasks execution time, following steps are planned to be executed:

```bash
powerbuddy syncsystem
shutdown -P now
```

`powerbuddy syncsystem` schedules the next automatic system startup according to the schedule. Further it plans the next execution of the two commands mentioned above again.

Finally, `shutdown -P now` shuts your system down.

### Rescheduling
If you edit a schedule which is already in place, `powerbuddy` ensures that everything scheduled before is cleaned up. After that, the updated schedule is used to plan the latest actions.

## Disable PowerBuddy
If you just want to stop `powerbuddy` from managing your systems up- and downtimes, simply call `powerbuddy disable`.