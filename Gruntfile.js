module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-bower-install-task');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-mocha-phantom-istanbul');
	grunt.loadNpmTasks('grunt-weinre');

	var fs = require('fs');
	var _ = require('lodash');
	var insertHTML = function(path, additionalContext) {
		var text = fs.readFileSync(__dirname + '/' + path);

		return _.template(text)(this);
	};

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		copy: {
			js: {
				expand: true,
				cwd: "./bower_components",
				src: ["requirejs/require.js", "jquery/dist/jquery.js", "bootstrap/dist/js/bootstrap.js", "lodash/lodash.js", '../node_modules/HashRouter/lib/HashRouter.js'],
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
				dest: "build/fonts",
				flatten: true
			},
			favicon: {
				files: {
					'build/favicon.png': ['favicon.png']
				}
			}
		},

		less: {
			compile: {
				files: {
					'css/main.css': ['less/main.less']
				}
			}
		},

		template: {
			DEV: {
				options: {
					data: {
						env: 'DEV',
						version: '<%- pkg.version %>',
						insertHTML: insertHTML
					}
				},
				files: {
					'index.html': ['index.tpl.html'],
					'js/version.js': ['js/version.tpl.js']
				}
			},
			PROD: {
				options: {
					data: {
						env: 'PROD',
						version: '<%- pkg.version %>',
						insertHTML: insertHTML
					}
				},
				files: {
					'build/index.html': ['index.tpl.html'],
					'js/version.js': ['js/version.tpl.js'],
					'build/cache.manifest': ['cache.tpl.manifest']
				}
			},

			TEST: {
				options: {
					data: {
						jsFolder: '../js'
					}
				},
				files: {
					'test/index.html': ['test/index.tpl.html']
				}
			},
			CODE_COVERAGE: {
				options: {
					data: {
						jsFolder: '../js-cov'
					}
				},
				files: {
					'test/index.html': ['test/index.tpl.html']
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
			build: ['build/3rd-party'],
			coverage: ['js-cov']
		},

		watch: {
			templates: {
				files: ['index.tpl.html', 'html/**/*.html'],
				tasks: ['template:DEV']
			},
			less: {
				files: ['less/*.less'],
				tasks: ['less']
			},
			tests: {
				files: ['test/index.tpl.html'],
				tasks: ['template:TEST']
			}
		},

		weinre: {
			dev: {
				options: {
					httpPort: 8081
				}
			}
		}
    });

    grunt.registerTask('test', ['template:TEST', 'mocha:test']);
    grunt.registerTask('coverage', ['prepareForCoverage', 'template:CODE_COVERAGE', 'mocha:coverage', 'clean:coverage']);

	grunt.registerTask('build-dev', ['bower_install', 'less', 'template:DEV', 'copy']);
	grunt.registerTask('build', ['bower_install', 'less', 'template:PROD', 'copy', 'requirejs', 'clean:build']);

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
