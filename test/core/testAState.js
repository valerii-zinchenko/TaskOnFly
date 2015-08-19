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

suite('AState', function(){
	suite('Test factory', function(){
		test('no arguments', function(){
			assert.throw(function(){
				new AState();
			}, Error, 'Incorrect input arguments. Expected AStateComponent ViewConstructor, [AStateComponent ControlConstructor]');
		});

		test('incorrect type of ViewConstructor', function(){
			assert.throw(function(){
				new AState({});
			}, Error, 'View constructor should be inherited from AStateComponent');
		});

		test('incorrect type of ControlConstructor', function(){
			assert.throw(function(){
				new AState(AView, {});
			}, Error, 'Control constructor should be inherited from AStateComponent');
		});

		test('correct arguments', function(){
			assert.doesNotThrow(function(){
				new AState(AView, AControl);
			});
		});
	});

	suite('Factory result', function(){
		suite('initialize()', function(){
			setup(function(){
				sinon.spy(AStateComponent.prototype, "connect");
			});
			teardown(function(){
				AStateComponent.prototype.connect.restore();
			});

			test('without model as input argument', function(){
				var result;
				assert.throw(function(){
					result = new (new AState(AView))();
				}, Error, 'Model is undefined');
			});

			test('without ControlConstructor', function(){
				var model = {};
				var result;
				assert.doesNotThrow(function(){
					result = new (new AState(AView))(model);
				});
				assert.isNotNull(result.view, 'View component of the state was not setup');
				assert.equal(result.view.model, model, 'Model was incorrectly set');
				assert.isTrue(AStateComponent.prototype.connect.called, 'Astate components should be connected');
			});

			test('with ControlConstructor', function(){
				var model = {};
				var result;
				assert.doesNotThrow(function(){
					result = new (new AState(AView, AControl))(model);
				});
				assert.isNotNull(result.view, 'View component of the state was not setup');
				assert.isNotNull(result.control, 'Control component of the state was not setup');
				assert.equal(result.control.model, model, 'Model was incorrectly set');
			});
		});

		suite('Methods', function(){
			suite('connect()', function(){
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
					assert.doesNotThrow(function(){
						new (new AState(AView))({});
					});

					assert.isTrue(AStateComponent.prototype.connect.calledOnce, 'State components was not connected to the view');
					assert.isFalse(AView.prototype.setControl.called, 'Control component should not be set when the state hasn\'t  control component');
					assert.isFalse(AControl.prototype.setView.called, 'View component should not be set to the control component when the state hasn\'t control component');
				});

				test('with control', function(){
					assert.doesNotThrow(function(){
						new (new AState(AView, AControl))({});
					});

					assert.isTrue(AView.prototype.setControl.calledOnce, 'Control component was not set to the view component');
					assert.isTrue(AControl.prototype.setView.calledOnce, 'View component was not set to the view component');

					assert.isTrue(AStateComponent.prototype.connect.calledTwice, 'State components was not connected to the view and control components');
					assert.isTrue(AStateComponent.prototype.connect.calledAfter(AView.prototype.setControl), 'State components should be connected after setupping of the control component to the view component');
					assert.isTrue(AStateComponent.prototype.connect.calledAfter(AControl.prototype.setView), 'State components should be connected after setupping of the view component to the control component');
				});

				test('execute twice', function(){
					assert.doesNotThrow(function(){
						var state = new (new AState(AView))({});
						state.connect();
					});

					assert.isTrue(AStateComponent.prototype.connect.calledOnce, 'State components should be connected only one time');
				});
			});
		});
	} );
});
