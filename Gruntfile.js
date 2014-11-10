module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jscoverage');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
                        './test/moks',
                        './js/model/TaskOnFly',
                        function() {
                            assert = require('chai').assert;
                            sinon = require('sinon');
                            _ = require('underscore');
                            Backbone = require('backbone');
                            requirejs = require('requirejs');
                            define = requirejs.define;


                            requirejs.config({
                                baseUrl: './js-cov/',
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
                    ]
                },
                src: ['test/**/*.js', '!test/moks.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage.html'
                },
                src: ['test/**/*.js', '!test/moks.js']
            }
        },
        clean: ['js-cov']
    });

    grunt.registerTask('default', 'test');
    grunt.registerTask('test', 'mochaTest:test');
    grunt.registerTask('coverage', function(){
        grunt.option('force', true);
        grunt.task.run(['jscoverage', 'mochaTest', 'clean']);
    });
};