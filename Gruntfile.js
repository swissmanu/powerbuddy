module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		mochaTest: {
			options: {
				reporter: 'spec'
				, require: 'test/lib'
			}
			, all: {
				src: 'test/spec/**/*.js'
			}
		}
	});

	grunt.registerTask('test', ['mochaTest:all']);
};