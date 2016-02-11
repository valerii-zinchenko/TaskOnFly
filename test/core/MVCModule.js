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

suite('MVCModule', function() {
	suite('Constructor', function(){
		[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].forEach(function(testCase){
			test('model: ' + testCase, function(){
				assert.throw(function(){
					new MVCModule(testCase, {});
				}, Error, 'Incorrect types of input arguments. Expected: Object model, Object states');
			});

			test('states: ' + testCase, function(){
				assert.throw(function(){
					new MVCModule({}, testCase);
				}, Error, 'Incorrect types of input arguments. Expected: Object model, Object states');
			});
		});

		test('correct input arguments', function(){
			var model = {};
			var states = {};

			var result;
			assert.doesNotThrow(function(){
				result = new MVCModule(model, states);
			});

			assert.equal(result.model, model, 'Model\'s object was incotrrectly set');
			assert.equal(result.states, states, 'States\' object was incotrrectly set');
		});
	});

	suite('Methods', function() {
		var uut;
		setup(function() {
			uut = new MVCModule({}, {
				state0: {},
				state1: {}
			});
		});
		teardown(function() {
			uut = null;
		});

		suite('getState', function() {
			[undefined, null, 0, 1, false, true, [], function(){}].forEach(function(testCase){
				test('Incorrect type of a states name: ' + testCase, function() {
					assert.throw(function() {
						uut.getState(testCase);
					}, Error, 'Incorrect type of the input argument. Expected: String stateName');
				});
			});

			test('Undefined state', function() {
				assert.throw(function() {
					uut.getState('str');
				}, Error, 'Undefined state "str"');
			});

			test('existing state', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getState('state0');
				});

				assert.equal(result, uut.states.state0, 'Incorrect existing state was returned');
			});
		});
	});
});
