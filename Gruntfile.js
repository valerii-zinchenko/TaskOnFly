module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-mocha-phantom-istanbul');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		copy: {
			js: {
				expand: true,
				cwd: "./bower_components",
				src: ["requirejs/require.js", "jquery/dist/jquery.js", "bootstrap/dist/js/bootstrap.js", "underscore/underscore.js", "backbone/backbone.js"],
				dest: "./3rd-party",
				flatten: true
			},
			fonts: {
				expand: true,
				cwd: "./bower_components/bootstrap/dist/fonts",
				src: ["*.*"],
				dest: "./3rd-party/bootstrap/fonts",
				flatten: true
			}
		},

		template: {
			DEV: {
				options: {
					data: {
						env: 'DEV'
					}
				},
				files: {
					'index.html': ['index.html.tpl'],
				}
			},
			PROD: {
				options: {
					data: {
						env: 'PROD',
						version: '<%- pkg.version %>'
					}
				},
				files: {
					'index.html': ['index.html.tpl'],
					'cache.manifest': ['cache.manifest.tpl']
				}
			}
		},

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    dir: 'min-js',
                    optimize: 'none',
                    useStrict: true,
					preserveLicenseComments: false,
                    modules: [
						{
							name: 'all'
						}
                    ]
                }
            }
        },
		prepareForCoverage: {
			instrument: {
				files: [{
					expand: true,
					cwd: 'js/',
					src: '**/*.js',
					dest: 'js-cov'
				}]
			}
		},
        mocha: {
            test: {
                options: {
                    run: false,
                    reporter: 'Spec',

                    log: true,
                    logErrors: true
                },
                src: ['test/index.html']
            },
            coverage: {
                options: {
                    run: false,
                    reporter: 'Spec',
                    log: true,
                    logErrors: true,
					coverage: {
						htmlReport: 'reports/coverage'
					}
                },
                src: ['test/index-cov.html']
            }
        },
        clean: ['js-cov']
    });

    grunt.registerTask('test', 'mocha:test');
    grunt.registerTask('coverage', ['prepareForCoverage', 'mocha:coverage', 'clean']);

	grunt.registerTask('default', 'copy');

	var istanbul = require('istanbul');
	grunt.registerMultiTask('prepareForCoverage', 'Generates coverage reports for JS using Istanbul', function() {
		var ignore = this.data.ignore || [];
		var instrumenter = new istanbul.Instrumenter();

		this.files.forEach(function(file) {
			var filename = file.src[0];
			var instrumented = grunt.file.read(filename);

			if (!grunt.file.isMatch(ignore, filename)) {
				instrumented = instrumenter.instrumentSync(instrumented, filename);
			}

			grunt.file.write(file.dest, instrumented);
		});
	});
};
