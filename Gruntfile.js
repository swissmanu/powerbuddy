module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		mochaTest: {
			options: {
				reporter: 'spec'
				, require: 'test/expect'
			}
			, all: {
				src: 'test/spec/**/*.js'
			}
		}

		, watch: {
			files: ['lib/**/*.js', 'bin/*', 'test/**/*.js']
			, tasks: ['test']
		}
	});

	grunt.registerTask('test', ['mochaTest:all']);
	grunt.registerTask('test:watch', ['mochaTest:all', 'watch']);
	grunt.registerTask('default', 'test:watch');
};