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
				[undefined, null, false, true, 0, 1, '', '1', [], function(){}].forEach(function(testCase){
					assert.throw(function() {
						new MVCModule(testCase);
					}, Error, 'Incorrect type of input argument');
				});
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

		});

		suite('State(s)', function() {
			test('No model states', function() {
				assert.throw(function() {
					new MVCModule({
						Model: function(){},
						Control: function(){}
					});
				}, Error, 'No model states are defined');
			});

			[undefined, null, 0, false, ''].forEach(function(testCase){
				test('No model states: ' + testCase, function() {
					assert.throw(function() {
						new MVCModule({
							Model: function(){},
							states: testCase
						});
					}, Error, 'No model states are defined');
				});
			});

			[1, true, '1', [], function(){}].forEach(function(testCase){
				test('Incorret type of model states: ' + testCase, function() {
					assert.throw(function() {
						new MVCModule({
							Model: function(){},
							states: testCase
						});
					}, Error, 'Incorrect type for defined model states');
				});
			});

			[undefined, null, 0, 1, false, true, '', '1', [], {}].forEach(function(testCase){
				test('Incorrect type of a state: ' + testCase, function() {
					assert.throw(function() {
						new MVCModule({
							Model: function(){},
							states: {
								state: testCase
							}
						});
					}, Error, 'Incorrect type of state "state", Function expected');
				});
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
				assert.isFunction(Constructors.states._implicit, '"_implicit" state shoube created by implicit state definition');
			});
		});
	});

	suite('Factory result', function() {
		var Module;
		var object;

		test('Forwarding input arguments to Model constructor', function(){
			var spyModelConstructor = sinon.spy();
			var args = [1,'2',{}];
			assert.doesNotThrow(function(){
				var Module = new MVCModule({
					Model: spyModelConstructor,
					View: AView
				});
				new Module(args);
			});

			assert.isTrue(spyModelConstructor.calledOnce, 'Model should be constructed once');
			assert.deepEqual(spyModelConstructor.args[0], args, 'Input arguments for Model constructor are incorrect');
		});

		suite('Forwarding state configurations to state constructors', function(){
			setup(function(){
				sinon.stub(AView.prototype, 'initialize', function(){});
			});
			teardown(function(){
				AView.prototype.initialize.restore();
			});

			test('forwarding', function(){
				var spyModelConstructor = sinon.spy();
				var args = [1,'2',{}];
				var config = {};
				assert.doesNotThrow(function(){
					var Module = new MVCModule({
						Model: spyModelConstructor,
						View: AView
					});
					new Module(args, config);
				});

				assert.deepEqual(spyModelConstructor.args[0], args, 'Input arguments for Model constructor are incorrect');
			});
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

				assert.isObject(module.states, 'MVCModule should always contain a state object');
				assert.isObject(module.states._implicit, '"_implicit" state was not created for module with single implicit state');
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
		suite('implicit state', function(){
			setup(function() {
				var Module = new MVCModule({
					Model: function() {},
					View: AView
				});

				object = new Module();
			});
			teardown(function() {
				object = null;
			});

			test('useState', function(){
				var state;
				assert.doesNotThrow(function(){
					state = object.useState('some non existing state');
				});

				assert.equal(state, object.states._implicit, 'Implicit state shoul be always returned for modules with impicit state');
			});
		});

		suite('explicit states', function(){
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

			suite('useState', function() {
				test('No arguments', function() {
					assert.throw(function() {
						object.useState();
					}, Error, 'Incorrect amount of input arguments');
				});

				[undefined, null, 0, 1, false, true, [], function(){}].forEach(function(testCase){
					test('Incorrect type: ' + testCase, function() {
						assert.throw(function() {
							object.useState(testCase);
						}, Error, 'Incorrect type of input argument');
					});
				});

				test('Undefined state', function() {
					assert.throw(function() {
						object.useState('str');
					}, Error, 'Undefined state "str"');
				});

				test('existing state', function(){
					var result;
					assert.doesNotThrow(function(){
						result = object.useState('state0');
					});

					assert.equal(result, object.states.state0, 'Incorrect existing state was returned');
				});
			});
		});

	});
});
