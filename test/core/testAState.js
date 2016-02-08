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

suite('State', function(){
		suite('Constructor', function(){
			setup(function(){
				sinon.spy(AStateComponent.prototype, "connect");
			});
			teardown(function(){
				AStateComponent.prototype.connect.restore();
			});

			suite('incorrect model', function(){
				[undefined, null, 0, 1, false, true, [], function(){}].forEach(function(testCase){
					test(testCase, function(){
						assert.throw(function(){
							new State(testCase);
						}, Error, 'Incorrect type of the model. Expected: Object');
					});
				});
			});

			suite('incorrect view', function(){
				[undefined, null, 0, 1, false, true, [], function(){}].forEach(function(testCase){
					test(testCase, function(){
						assert.throw(function(){
							new State({}, testCase);
						}, Error, 'View constructor should be inherited from AStateComponent');
					});
				});
			});
		});

		suite('Methods', function(){
			suite('connect', function(){
				setup(function(){
					sinon.spy(AStateComponent.prototype, 'connect');
					sinon.spy(AView.prototype, 'setControl');
					sinon.spy(AControl.prototype, 'setView');
				});
				teardown(function(){
					AStateComponent.prototype.connect.restore();
					AView.prototype.setControl.restore();
					AControl.prototype.setView.restore();
				});

				test('without control', function(){
					var model = {};

					assert.doesNotThrow(function(){
						new State(model, new AView(model));
					});

					assert.isTrue(AStateComponent.prototype.connect.calledOnce, 'State components was not connected to the view');
					assert.isFalse(AView.prototype.setControl.called, 'Control component should not be set when the state hasn\'t  control component');
					assert.isFalse(AControl.prototype.setView.called, 'View component should not be set to the control component when the state hasn\'t control component');
				});

				test('with control', function(){
					var model = {};

					assert.doesNotThrow(function(){
						new State(model, new AView(model), new AControl(model));
					});

					assert.isTrue(AView.prototype.setControl.calledOnce, 'Control component was not set to the view component');
					assert.isTrue(AControl.prototype.setView.calledOnce, 'View component was not set to the view component');

					assert.isTrue(AStateComponent.prototype.connect.calledTwice, 'State components was not connected to the view and control components');
					assert.isTrue(AStateComponent.prototype.connect.calledAfter(AView.prototype.setControl), 'State components should be connected after setupping of the control component to the view component');
					assert.isTrue(AStateComponent.prototype.connect.calledAfter(AControl.prototype.setView), 'State components should be connected after setupping of the view component to the control component');
				});

				test('execute twice', function(){
					var model = {};

					assert.doesNotThrow(function(){
						var state = new State(model, new AView(model));
						state.connect();
					});

					assert.isTrue(AStateComponent.prototype.connect.calledOnce, 'State components should be connected only one time');
				});
			});
		});
});
