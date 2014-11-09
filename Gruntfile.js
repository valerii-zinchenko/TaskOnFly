module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
                                baseUrl: './_js/',
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
                src: ['test/core/*.js', 'test/model/testT*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage.html'
                },
                src: ['test/core/*.js', 'test/model/testT*.js']
            }
        }
    });

    grunt.registerTask('pretest', function() {
        jscoverage = require('jscoverage');

        srcPrefix =  './js/';
        destPrefix = './_js/';

        [
            'core/AClass.js',
            'core/Class.js',
            'core/MVCModule.js',
            'core/SingletonClass.js',
            'core/utils.js',

            'model/TaskOnFly.js',
            'model/Task.js',
            'model/TaskList.js',
            'model/MainRouter.js',

            'pages/About/View.js',
            'pages/About.js',
            'pages/APage/View.js',
            'pages/Home/Control.js',
            'pages/Home/View.js',
            'pages/Home.js',
            'pages/ItemEditor/Control.js',
            'pages/ItemEditor/View.js',
            'pages/ItemEditor.js',

            'view/PopupDialog.js',

            'modules/APanel/View.js',
            'modules/FastTask/Control.js',
            'modules/FastTask/View.js',
            'modules/FastTask.js',
            'modules/ListView/Control.js',
            'modules/ListView/View.js',
            'modules/ListView.js',
            'modules/MainPanel/View.js',
            'modules/MainPanel.js',
            'modules/SimpleSearch/Control.js',
            'modules/SimpleSearch/View.js',
            'modules/SimpleSearch.js',

            'main.js'
        ].forEach(function(file) {
            jscoverage.processFile(srcPrefix + file, destPrefix + file);
        });
    });
    grunt.registerTask('posttest', function() {
        var rim = require('rimraf');
        rim('./_js', function() {console.log(arguments)});
    });

    grunt.registerTask('default', 'mochaTest');
    grunt.registerTask('coverage', ['pretest', 'mochaTest', 'posttest']);
};