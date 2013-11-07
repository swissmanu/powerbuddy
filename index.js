/*require('crontab').load(function(err, tab) {
	if(err) {
		console.err(err);
	}

	var command = '/usr/bin/env echo "test"'
		, comment = 'powerbuddy';

	//var item = tab.create(command, uuid);
	//item.everyReboot();

	tab.remove(tab.findComment(comment));

	tab.save(function() {
		console.log('saved');
	});
});/*

module.exports = {
	plan: plan
	, planStart: planStart
	, planShutdown: planShutdown
}*/