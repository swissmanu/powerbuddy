module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-cov');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-plato');


	grunt.initConfig({
		mochacov: {
			options: {
				reporter: 'spec'
				, require: ['test/expect']
				, files: 'test/spec/**/*.js'
			}
			, test: { }
			, coveralls: {
				options: {
					coveralls: {
						serviceName: 'travis-ci'
						, repoToken: 'rUSktDB7YAuPMvcRI8ADDZ3GRJCtSWaf4'
					}
				}
			}
		}

		, jshint: {
			options: {
				jshintrc: '.jshintrc'
			}
			, all: [ 'lib/**/*.js' ]
		}

		, watch: {
			files: ['lib/**/*.js', 'bin/*', 'test/**/*.js']
			, tasks: ['test']
		}

		, plato: {
			source: {
				options: {
					jshint : grunt.file.readJSON('.jshintrc')
				}
				, files: {
					'plato/': ['lib/**/*.js']
				}
			}
		}
	});

	grunt.registerTask('test', ['mochacov:test']);
	grunt.registerTask('test:watch', ['mochacov:test', 'watch']);
	grunt.registerTask('test:coveralls', ['mochacov:coveralls']);
	grunt.registerTask('metrics', 'plato');

	grunt.registerTask('default', 'test:watch');
};