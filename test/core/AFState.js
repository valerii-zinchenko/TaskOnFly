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

suite('AFState', function(){
	suite('incorrect input arguments', function(){
		[
			[],
			[undefined],
			[null],
			[false],
			[true],
			[0],
			[1],
			[''],
			['str'],
			[[]],
			[{}],
			[function(){}, true],
			[function(){}, 1],
			[function(){}, 'str'],
			[function(){}, []],
			[function(){}, {}]
		].forEach(function(testCase){
			test('input arguments: ' + JSON.stringify(testCase), function(){
				assert.throw(function(){
					AFState.apply(null, testCase);
				}, Error, 'Incorrect input arguments. Expected Function ViewConstructor, [Function ControlConstructor]');
			});
		});
	});

	suite('correct arguments', function(){
		[
			[function(){}],
			[function(){}, function(){}]
		].forEach(function(testCase){
			test(JSON.stringify(testCase), function(){
				assert.doesNotThrow(function(){
					AFState.apply(null, testCase);
				});
			});
		});
	});

	suite('State builder. Integration tests with State', function(){
		setup(function(){
			sinon.spy(AStateComponent.prototype, "connect");
		});
		teardown(function(){
			AStateComponent.prototype.connect.restore();
		});

		test('without model in input arguments', function(){
			var result;
			assert.throw(function(){
				result = (AFState(AView))();
			}, Error, 'Incorrect type of the model. Expected: Object');
		});

		test('without ControlConstructor', function(){
			var model = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState(AView))(model);
			});

			assert.isNotNull(result.view, 'View component of the state was not setup');
			assert.equal(result.view.model, model, 'Model was incorrectly set');
		});

		test('with ControlConstructor', function(){
			var model = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState(AView, AControl))(model);
			});

			assert.isNotNull(result.view, 'View component of the state was not setup');
			assert.isNotNull(result.control, 'Control component of the state was not setup');
			assert.equal(result.control.model, model, 'Model was incorrectly set');
		});

		test('state\'s configuration', function(){
			var config = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState(AView, AControl))({}, config);
			});

			assert.equal(result.view.config, config, 'Configuration was incorrectly set to the view');
			assert.equal(result.control.config, config, 'Configuration was incorrectly set to the control');
		});
	});
});
