/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/

"use strict";

define(['core/MVCModule'], function() {
    suite('MVCModule', function() {
        suite('Test factory function', function() {
            suite('General', function() {
                test('No input arguments', function() {
                    assert.throw(function() {
                        new MVCModule();
                    }, Error, 'Incorrect amount of input arguments');
                });
                test('Incorrect type of input argument', function() {
                    assert.throw(function() {
                        new MVCModule(':]');
                        new MVCModule([]);
                        new MVCModule(function(){});
                    }, Error, 'Incorrect type of input argument');
                });
                test('No Model constructor', function() {
                    assert.throw(function() {
                        new MVCModule({
                            hello: ':]'
                        });
                    }, Error, 'Constructor for Model is not defined');
                });
                test('No states', function() {
                    assert.throw(function() {
                        new MVCModule({
                            Model: function(){}
                        });
                        new MVCModule({
                            Model: function(){},
                            View: function(){}
                        });
                        new MVCModule({
                            Model: function(){},
                            Control: function(){}
                        });
                    }, Error, 'No model states are defined');
                });
            });

            suite('State(s)', function() {
                test('Incorret type of model states', function() {
                    assert.throw(function() {
                        new MVCModule({
                            Model: function(){},
                            states: ':]'
                        });
                        new MVCModule({
                            Model: function(){},
                            states: []
                        });
                        new MVCModule({
                            Model: function(){},
                            states: function(){}
                        });
                    }, Error, 'Incorrect type for defined model states');
                });
                test('Incorrect type of state', function() {
                    assert.throw(function() {
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state0: ':]'
                            }
                        });
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state0: []
                            }
                        });
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state0: function(){}
                            }
                        });
                    }, Error, 'Incorrect type of state "state0"');
                });
                test('Empty state', function() {
                    assert.throw(function() {
                        new MVCModule({
                            Model: function() {},
                            states: {
                                state0: {}
                            }
                        });
                    }, Error, 'View constructor for state "state0" is not defined');
                });
                test('Control for state is not defined', function() {
                    assert.throw(function() {
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state0: {
                                    View: function() {}
                                }
                            }
                        });
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state: {
                                    View: function(){},
                                    Control: function(){}
                                },
                                state0: {
                                    View: function() {}
                                }
                            }
                        });
                    }, Error, 'Control constructor for state "state0" is not defined');
                });
                test('View for state is not defined', function() {
                    assert.throw(function() {
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state0: {
                                    Control: function() {}
                                }
                            }
                        });
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state: {
                                    View: function(){},
                                    Control: function(){}
                                },
                                state0: {
                                    Control: function(){}
                                }
                            }
                        });
                    }, Error, 'View constructor for state "state0" is not defined');
                });
                test('Correct input object', function() {
                    assert.doesNotThrow(function() {
                        new MVCModule({
                            Model: function(){},
                            View: function(){},
                            Control: function(){}
                        });
                        new MVCModule({
                            Model: function(){},
                            states: {
                                state: {
                                    View: function(){},
                                    Control: function(){}
                                },
                                state0: {
                                    View: function(){},
                                    Control: function(){}
                                }
                            }
                        });
                    });
                });
            });
        });

        suite('Test module and sub-module constructors', function() {
            var Module;
            var object;

            teardown(function() {
                Module = null;
                object = null;
            });

            suite('Test created states and internal references to other module components', function() {
                setup(function() {
                    Module = new MVCModule({
                        Model: function(){},
                        states: {
                            state0: {
                                View: function(){},
                                Control: function(){}
                            },
                            state1: {
                                View: function(){},
                                Control: function(){}
                            }
                        }
                    });
                });
                teardown(function(){
                    Module = null;
                    object = null;
                });

                test('States', function() {
                    assert.doesNotThrow(function() {
                        object = new Module();
                    });

                    assert.isObject(object.states, '"states" object was not created');

                    assert.isObject(object.states.state0, 'state "state0" is not defined');
                    assert.isObject(object.states.state1, 'state "state1" is not defined');
               });
               test('References to state components', function() {
                    assert.doesNotThrow(function() {
                        object = new Module();
                    });

                    assert.isObject(object.states.state0.view, 'no reference to the View object in state "state0"');
                    assert.isObject(object.states.state0.control, 'no reference to the Control object in state "state0"');

                    assert.isObject(object.states.state1.view, 'no reference to the View object in state "state1"');
                    assert.isObject(object.states.state1.control, 'no reference to the Control object in state "state1"');
               });
               test('Internal references', function() {
                    assert.doesNotThrow(function() {
                        object = new Module();
                    });

                    assert.isNull(object.view, 'In multiple state model view should be null directly after constructing');
                    assert.isNull(object.control, 'In multiple state model control should be null directly after constructing');

                    assert.equal(object.states.state0.view.model, object.model, 'View has incorrect reference to modeule\'s model in state "state0"');
                    assert.equal(object.states.state0.view.control, object.states.state0.control, 'View has incorrect reference to control in state "state0"');
                    assert.equal(object.states.state0.control.model, object.model, 'Control has incorrect reference to modeule\'s model in state "state0"');
                    assert.equal(object.states.state0.control.view, object.states.state0.view, 'Control has incorrect reference to view in state "state0"');

                    assert.equal(object.states.state1.view.model, object.model, 'View has incorrect reference to modeule\'s model in state "state1"');
                    assert.equal(object.states.state1.view.control, object.states.state1.control, 'View has incorrect reference to control in state "state1"');
                    assert.equal(object.states.state1.control.model, object.model, 'Control has incorrect reference to modeule\'s model in state "state1"');
                    assert.equal(object.states.state1.control.view, object.states.state1.view, 'Control has incorrect reference to view in state "state1"');
               });
            });

            suite('Test single state', function() {
                setup(function() {
                    Module = new MVCModule({
                        Model: function(){},
                        View: function(){},
                        Control: function(){}
                    });
                });
                teardown(function() {
                    Module = null;
                    object = null;
                });

                test('Test "_default" state', function() {
                    assert.doesNotThrow(function() {
                        object = new Module();
                    });

                    assert.isObject(object.model, 'Returned object has not the reference to the Model');
                    assert.isObject(object.view, 'Returned object has not the reference to the View');
                    assert.isObject(object.control, 'Returned object has not the reference to the Control');
                });
                test('Internal references', function() {
                    assert.doesNotThrow(function() {
                        object = new Module();
                    });

                    assert.equal(object.view.model, object.model, 'Incorrect reference to the modules\' Mode');
                    assert.equal(object.view.control, object.control, 'Incorrect reference to the Control');

                    assert.equal(object.control.model, object.model, 'Incorrect reference to the modules\' Mode');
                    assert.equal(object.control.view, object.view, 'Incorrect reference to the View');
                });
            });

            test('Create module object with input arguments', function() {
                var input = ['a', 'b'];

                assert.doesNotThrow(function() {
                    Module = new MVCModule({
                        Model: function(a, b) {
                            this.a = a;
                            this.b = b;
                        },
                        states: {
                            state: {
                                View: function(){},
                                Control: function(){}
                            }
                        }
                    });

                    object = new Module(input[0], input[1]);
                });

                assert.equal(object.model.a, input[0], 'First input argument was not applied to the model');
                assert.equal(object.model.b, input[1], 'Second input argument was not applied to the model');
            });
        });

        suite('Object methods', function() {
            var Module;
            var object;

            setup(function() {
                Module = new MVCModule({
                    Model: function() {},
                    states: {
                        state: {
                            View: function(){},
                            Control: function(){}
                        },
                        state0: {
                            View: function(){},
                            Control: function(){}
                        }
                    }
                });

                object = new Module();
            });
            teardown(function() {
                Module  = null;
                object = null;
            });

            suite('useState()', function() {
                test('No arguments', function() {
                    assert.throw(function() {
                        object.useState();
                    }, Error, 'Incorrect amount of input arguments');
                });
                test('Incorrect type', function() {
                    assert.throw(function() {
                        object.useState(null);
                        object.useState(undefined);
                        object.useState(1);
                        object.useState(true);
                        object.useState([]);
                        object.useState(function(){});
                        object.useState({});
                    }, Error, 'Incorrect type of input argument');
                });
                test('Undefined state', function() {
                    assert.throw(function() {
                        object.useState('str');
                    }, Error, 'Undefined state "str"');
                });
            });
        });
    });
});
