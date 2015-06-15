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
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
					new MVCModule([]);
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
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
			test('Incorrect type of Model constructor', function(){
				assert.throw(function(){
					new MVCModule({
						Model: ':]'
					});
				}, Error, 'Model constructor should be a function');
				assert.throw(function(){
					new MVCModule({
						Model: []
					});
				}, Error, 'Model constructor should be a function');
				assert.throw(function(){
					new MVCModule({
						Model: {}
					});
				}, Error, 'Model constructor should be a function');
			});

			test('No model states', function() {
				assert.throw(function() {
					new MVCModule({
						Model: function(){}
					});
				}, Error, 'No model states are defined');
				assert.throw(function() {
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
				}, Error, 'Incorrect type for defined model states');
				assert.throw(function() {
					new MVCModule({
						Model: function(){},
						states: []
					});
				}, Error, 'Incorrect type for defined model states');
				assert.throw(function() {
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
							state: ':]'
						}
					});
				}, Error, 'Incorrect type of state "state", Function expected');
				assert.throw(function() {
					new MVCModule({
						Model: function(){},
						states: {
							state: []
						}
					});
				}, Error, 'Incorrect type of state "state", Function expected');
				assert.throw(function() {
					new MVCModule({
						Model: function(){},
						states: {
							state: {}
						}
					});
				}, Error, 'Incorrect type of state "state", Function expected');
			});
			test('Correct state definition', function() {
				assert.doesNotThrow(function() {
					new MVCModule({
						Model: function(){},
						states: {
							state: function(){}
						}
					});
				});
			});

			test('Implicit state', function(){
				var Constructors = {
					Model: function(){},
					View: AView,
					Control: AControl
				};
				
				assert.doesNotThrow(function(){
					new MVCModule(Constructors);
				});

				assert.isObject(Constructors.states, '"states" Object should be created by defining implicit state');
				assert.isFunction(Constructors.states._default, '"_default" state shoube created by implicit state definition');
			});
		});
	});

	suite('Factory result', function() {
		var Module;
		var object;

		test('Redirecting input arguments to Model constructor', function(){
			var spyModelConstructor = sinon.spy();
			var args = [1,'2',{}];
			assert.doesNotThrow(function(){
				var Module = new MVCModule({
					Model: spyModelConstructor,
					View: AView
				});
				new Module(args[0], args[1], args[2]);
			});

			assert.equal(spyModelConstructor.args[0][0], args[0], 'First input argeumnt for Model constructor is incorrect');
			assert.equal(spyModelConstructor.args[0][1], args[1], 'Second input argeumnt for Model constructor is incorrect');
			assert.equal(spyModelConstructor.args[0][2], args[2], 'Third input argeumnt for Model constructor is incorrect');
		});

		suite('Creating states', function() {
			test('Implicit state', function(){
				var module;
				assert.doesNotThrow(function() {
					var Module = new MVCModule({
						Model: function(){},
						View: AView
					});

					module = new Module();
				});

				assert.isUndefined(module.states, '"states" should be undefied, because "_default" state is directly returned');
				assert.isObject(module.model, 'model should be accessible from "_default" state');
				assert.isObject(module.view, 'view should be accessible from "_default" state');
			});

			test('Explicit states', function(){
				var module;
				assert.doesNotThrow(function() {
					var Module = new MVCModule({
						Model: function(){},
						states: {
							state0: new AState(AView),
							state1: new AState(AView)
						}
					});

					module = new Module();
				});

				assert.isObject(module.states, '"states" object was not created for module with explicit states');
				assert.isObject(module.states.state0, 'State "state0" was not created for module with explicit states');
				assert.isObject(module.states.state1, 'State "state1" was not created for module with explicit states');
			});
		});
	});

	suite('Object methods', function() {
		var object;
		setup(function() {
			var Module = new MVCModule({
				Model: function() {},
				states: {
					state0: new AState(AView),
					state1: new AState(AView)
				}
			});

			object = new Module();
		});
		teardown(function() {
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
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
					object.useState(undefined);
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
					object.useState(1);
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
					object.useState(true);
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
					object.useState([]);
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
					object.useState(function(){});
				}, Error, 'Incorrect type of input argument');
				assert.throw(function() {
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
