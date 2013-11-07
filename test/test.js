var powerbuddy = require('../index.js');

powerbuddy.planShutdown('everyday', '01:00');
powerbuddy.planStart('weekend', '10:00');
powerbuddy.planStart('weekday', '17:00');
powerbuddy.planShutdown(['sunday', 'monday'], '10:00');
powerbuddy.plan('monday', '10:00', '22:00');