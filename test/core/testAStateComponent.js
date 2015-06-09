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

suite('AStateComponent', function(){
	suite('Constructor', function() {
		test('initialize()', function() {
			assert.doesNotThrow(function(){
				new AStateComponent();
			});
		});
	});

	suite('Methods', function(){
		var aStateComponent;
		setup(function(){
			aStateComponent = new AStateComponent();
		});
		teardown(function(){
			aStateComponent = null;
		});

		test('setModel()', function() {
			var model = {};
			assert.doesNotThrow(function(){
				aStateComponent.setModel(model);
			});
			assert.equal(aStateComponent.model, model, 'Model object was incorreclty set');
		});

		test('connect()', function(){
			assert.doesNotThrow(function(){
				aStateComponent.connect();
			});
		});

		test('destruct()', function() {
			assert.doesNotThrow(function(){
				aStateComponent.setModel({});
				aStateComponent.destruct();
			});

			assert.isNull(aStateComponent.model, 'destruct() should set model to null');
		});
	});
});
