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
				dest: "build/3rd-party",
				flatten: true
			},
			css: {
				src: 'css/main.css',
				dest: 'build/'
			},
			fonts: {
				expand: true,
				cwd: "./bower_components/bootstrap/dist/fonts",
				src: ["*.*"],
				dest: "build/3rd-party/bootstrap/fonts",
				flatten: true
			}
		},

		template: {
			DEV: {
				options: {
					data: {
						env: 'DEV',
						version: '<%- pkg.version %>'
					}
				},
				files: {
					'index.html': ['index.html.tpl'],
					'js/version.js': ['js/version.js.tpl']
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
					'build/index.html': ['index.html.tpl'],
					'js/version.js': ['js/version.js.tpl'],
					'build/cache.manifest': ['cache.manifest.tpl']
				}
			},

			TEST: {
				options: {
					data: {
						jsFolder: '../js'
					}
				},
				files: {
					'test/config.js': ['test/config.js.tpl']
				}
			},
			CODE_COVERAGE: {
				options: {
					data: {
						jsFolder: '../js-cov'
					}
				},
				files: {
					'test/config.js': ['test/config.js.tpl']
				}
			}
		},

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    dir: 'build/js',
                    optimize: 'uglify2',
                    useStrict: true,
					removeCombined: true,
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
                src: ['test/index.html']
            }
        },

        clean: {
			build: ['build/3rd-party/*.js'],
			coverage: ['js-cov']
		}
    });

    grunt.registerTask('test', ['template:TEST', 'mocha:test']);
    grunt.registerTask('coverage', ['prepareForCoverage', 'template:CODE_COVERAGE', 'mocha:coverage', 'clean:coverage']);

	grunt.registerTask('build', ['copy', 'template:PROD', 'requirejs', 'clean:build']);

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
