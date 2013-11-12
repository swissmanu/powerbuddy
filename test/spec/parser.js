describe('Parser', function() {
	var parser = require('../../lib/parser');

	describe('parseDate', function() {
		it('should be a function', function() {
			expect(parser.parseDate).to.be.a.function;
		});
	});

});