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

'use strict';

suite('AFMVCModule', function() {
	suite('Input constructors', function() {
		suite('Exceptions', function() {
			[].concat(
				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].map(function(testCase){
					return {
						input: testCase,
						error: 'Incorrect type of an input argument. Expected: Object MVCConstructors'
					};
				}),
				
				[{hello: ':]'}].map(function(testCase){
					return {
						input: testCase,
						error: 'Model constructor should be a function'
					};
				}),

				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: testCase
						},
						error: 'Model constructor should be a function'
					};
				}),

				{
					input: {
						Model: function(){},
						Control: function(){}
					},
					error: 'No model states are defined'
				},
				[undefined, null, false, 0, ''].map(function(testCase){
					return {
						input: {
							Model: function(){},
							states: testCase
						},
						error: 'No model states are defined'
					};
				}),

				[true, 1, 'str', [], function(){}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							states: testCase
						},
						error: 'Incorrect type for defined model states'
					};
				}),

				[undefined, null, 0, 1, false, true, '', '1', [], {}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							states: {
								state: testCase
							}
						},
						error: 'Incorrect type of state "state", Function expected'
					};
				})
			).forEach(function(testCase){
				test('Input: ' + JSON.stringify(testCase.input) + '; exception: ' + testCase.error, function() {
					assert.throw(function() {
						AFMVCModule(testCase.input);
					}, Error, testCase.error);
				});
			});
		});

		test('Correct state definition', function() {
			assert.doesNotThrow(function() {
				AFMVCModule({
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
				AFMVCModule(Constructors);
			});

			assert.isObject(Constructors.states, '"states" Object should be created by defining implicit state');
			assert.isFunction(Constructors.states._implicit, '"_implicit" state shoube created by implicit state definition');
		});
	});

	suite('Integration', function() {
		suite('Module\'s constructors', function(){
			setup(function(){
				sinon.stub(AView.prototype, 'initialize', function(){});
				sinon.stub(AControl.prototype, 'initialize', function(){});
			});
			teardown(function(){
				AView.prototype.initialize.restore();
				AControl.prototype.initialize.restore();
			});

			test('Model\'s constructor', function(){
				var spyModel = sinon.spy();
				var args = [1,'2',{}];
				var config = {};

				assert.doesNotThrow(function(){
					var Factory = AFMVCModule({
						Model: spyModel,
						View: AView,
						Control: AControl
					});
					Factory(args, {_implicit: config});
				});

				assert.isTrue(spyModel.calledOnce, 'Model\'s constructor should be constructed once');
				assert.deepEqual(spyModel.args[0], args, 'Input arguments for Model\'s constructor were incorrectly forwarded');

				assert.isTrue(AView.prototype.initialize.calledOnce, 'View\'s constructor should be called once');
				assert.equal(AView.prototype.initialize.args[0][1], config, 'Configurations were incorrectly forwarded to a view\'s constructor');

				assert.isTrue(AControl.prototype.initialize.calledOnce, 'Control\'s constructor should be called once');
				assert.equal(AControl.prototype.initialize.args[0][1], config, 'Configurations were incorrectly forwarded to a control\'s constructor');
			});
		});

		suite('Creating states', function() {
			test('Implicit state', function(){
				var module;
				assert.doesNotThrow(function() {
					var Factory = AFMVCModule({
						Model: function(){},
						View: AView
					});

					module = Factory();
				});

				assert.isObject(module.states, 'AFMVCModule should always contain a state object');
				assert.isObject(module.states._implicit, '"_implicit" state was not created for module with single implicit state');
			});

			test('Explicit states', function(){
				var module;
				assert.doesNotThrow(function() {
					var Factory = AFMVCModule({
						Model: function(){},
						states: {
							state0: new AState(AView),
							state1: new AState(AView)
						}
					});

					module = Factory();
				});

				assert.isObject(module.states, '"states" object was not created for module with explicit states');
				assert.isObject(module.states.state0, 'State "state0" was not created for module with explicit states');
				assert.isObject(module.states.state1, 'State "state1" was not created for module with explicit states');
			});
		});
	});
});
