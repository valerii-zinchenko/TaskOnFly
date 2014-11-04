"use strict";

suite('Test MVCModule', function() {
    suite('Test factory function', function() {
        test('No input arguments', function() {
            assert.throw(function() {
                new MVCModule();
            }, Error, 'Incorrect amount of input arguments');
        });
        test('Incorrect type of single input argument', function() {
            assert.throw(function() {
                new MVCModule(':)');
            }, Error, 'No sub-module constructors are defined. At least one sub-module constructor should be defined');
        });
        test('MVC sub-module constructor is not defined', function() {
            assert.throw(function() {
                new MVCModule({
                    hello: ':)'
                });
            }, Error, 'No sub-module constructors are defined. At least one sub-module constructor should be defined');
        });
        test('Incorrect Model constructor', function() {
            assert.throw(function() {
                new MVCModule({
                    Model: ':)'
                });
            }, Error, 'Model constructor should be a function');
        });
        test('Incorrect View constructor', function() {
            assert.throw(function() {
                new MVCModule({
                    View: ':)'
                });
            }, Error, 'View constructor should be a function');
        });
        test('Incorrect Control constructor', function() {
            assert.throw(function() {
                new MVCModule({
                    Control: ':)'
                });
            }, Error, 'Control constructor should be a function');
        });

        test('Define Model constructor', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    Model: function() {}
                });
            });
        });
        test('Define View constructor', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    View: function() {}
                });
            });
        });
        test('Define Control constructor', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    Control: function() {}
                });
            });
        });
        test('Define Model and View constructors', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    Model: function() {},
                    View: function() {}
                });
            });
        });
        test('Define Model and Control constructors', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    Model: function() {},
                    Control: function() {}
                });
            });
        });
        test('Define View and Control constructors', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    View: function() {},
                    Control: function() {}
                });
            });
        });
        test('Define Model, View and Control constructors', function() {
            assert.doesNotThrow(function() {
                new MVCModule({
                    Model: function() {},
                    View: function() {},
                    Control: function() {}
                });
            });
        });
    });


    suite('Test module constructor', function() {
        test('Create module object without input arguments', function() {
            var Module;
            var module;

            assert.doesNotThrow(function() {
                Module = new MVCModule({
                    Model: function() {},
                    View: function() {},
                    Control: function() {}
                });

                module = new Module();
            });

            assert.isObject(module.model, 'Incorrect type for model sub-module');
            assert.isObject(module.view, 'Incorrect type for view sub-module');
            assert.isObject(module.control, 'Incorrect type for control sub-module');
        });

        test('Create module object with input arguments', function() {
            var Module;
            var module;
            var input = {
                model: 'model',
                view: 'view',
                control: 'control'
            };

            assert.doesNotThrow(function() {
                Module = new MVCModule({
                    Model: function(name) {this.name = name;},
                    View: function(name) {this.name = name;},
                    Control: function(name) {this.name = name;}
                });

                module = new Module(input);
            });

            assert.equal(module.model.name, input.model, 'Model sub-module was incorrect created');
            assert.equal(module.view.name, input.view, 'View sub-module was incorrect created');
            assert.equal(module.control.name, input.control, 'Control sub-module was incorrect created');
        });

        test('Module initialize()', function() {
            var Module;
            var module;
            var counter = 0;

            assert.doesNotThrow(function() {
                Module = new MVCModule({
                    Model: function() {this.id = ++counter;},
                    initialize: function() {this.id = ++counter;}
                });

                module = new Module();
            });

            assert.equal(counter, 2, 'Some of the constructors was not executed');
            assert.equal(module.model.id, 1, 'Sub-module constructor should be executed first');
            assert.equal(module.id, 2, 'Module initialize method should be executed after sub-module constructors');
        });
    });
});
