module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jscoverage');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    function SET_GLOBALS(path) {
        assert = require('chai').assert;
        sinon = require('sinon');
        _ = require('underscore');
        Backbone = require('backbone');
        require('./test/mocks');
        require('./js/model/TaskOnFly');
        requirejs = require('requirejs');
        define = requirejs.define;


        requirejs.config({
            baseUrl: path,
            nodeRequire: require
        });

        var src = './js/';
        AClass = require(src + 'core/AClass');
        Class = require(src + 'core/Class');
        SingletonClass = require(src + 'core/SingletonClass');
        MVCModule = require(src + 'core/MVCModule');
        utils = require(src + 'core/utils');

        TaskManager = {
            Pages: {},
            Modules: {}
        };
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    dir: 'min-js',
                    optimize: 'none',
                    modules: [
                        {
                            name: 'core/AClass',
                            include: [
                                'core/utils',
                                'core/Class',
                                'core/SingletonClass',
                                'core/MVCModule'
                            ]
                        },
                        {
                            name: 'pages/ItemEditor'
                        },
                        {
                            name: 'main'
                        }
                    ],
                    useStrict: true
                }
            }
        },
        jscoverage: {
            src: {
                expand: true,
                cwd: 'js/',
                src: ['**/*.js', '!lib/**/*.js', '!tmp/**/*.js'],
                dest: 'js-cov',
                ext: '.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    ui: 'tdd',
                    reporter: 'spec',
                    quite: true,
                    require: [
                        SET_GLOBALS.bind(null, 'js/')
                    ]
                },
                src: ['test/**/*.js', '!test/mocks.js', '!test/beforetest.js']
            },
            testWithCoverage: {
                options: {
                    ui: 'tdd',
                    reporter: 'spec',
                    quite: true,
                    require: [
                        SET_GLOBALS.bind(null, './js-cov/')
                    ]
                },
                src: ['test/**/*.js', '!test/mocks.js', '!test/beforetest.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'reports/Coverage.html'
                },
                src: ['test/**/*.js', '!test/mocks.js', '!test/beforetest.js']
            }
        },
        clean: ['js-cov']
    });

    grunt.registerTask('default', 'test');
    grunt.registerTask('test', 'mochaTest:test');
    grunt.registerTask('coverage', function(){
        grunt.option('force', true);
        grunt.task.run(['jscoverage', 'mochaTest:testWithCoverage', 'mochaTest:coverage', 'clean']);
    });
};