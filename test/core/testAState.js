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
			test('without ControlConstructor', function(){
				var result;
				assert.doesNotThrow(function(){
					result = new (new AState(AView))();
				});
				assert.isNotNull(result.view, 'View component of the state was not setup');
			});
			test('with ControlConstructor', function(){
				var result;
				assert.doesNotThrow(function(){
					result = new (new AState(AView, AControl))();
				});
				assert.isNotNull(result.view, 'View component of the state was not setup');
				assert.isNotNull(result.control, 'Control component of the state was not setup');
			});
		});

		suite('Methods', function(){
			var stateWithView;
			var stateWithViewControl;

			setup(function(){
				stateWithView = new (new AState(AView));
				stateWithViewControl = new (new AState(AView, AControl));
			});
			teardown(function(){
				stateWithView = null;
				stateWithViewControl = null;
			});

			suite('setModel()', function(){
				setup(function(){
					sinon.spy(AStateComponent.prototype, 'setModel');
				});
				teardown(function(){
					AStateComponent.prototype.setModel.restore();
				});

				test('without control', function(){
					var model = {};
					assert.doesNotThrow(function(){
						stateWithView.setModel(model);
					});
					assert.equal(stateWithView.model, model, 'Model was incorrectly set');
					assert.isTrue(AStateComponent.prototype.setModel.calledOnce, 'Model was not set to the view component');
				});

				test('with control', function(){
					var model = {};
					assert.doesNotThrow(function(){
						stateWithViewControl.setModel(model);
					});
					assert.equal(stateWithViewControl.model, model, 'Model was incorrectly set');
					assert.isTrue(AStateComponent.prototype.setModel.calledTwice, 'Model was not set to the view and control components');
				});
			});

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

				test('without model', function(){
					assert.throw(function(){
						stateWithView.connect();
					}, Error, 'Model is not set for the state');
				});

				test('without control', function(){
					assert.doesNotThrow(function(){
						stateWithView.setModel({});
						stateWithView.connect();
					});

					assert.isTrue(AStateComponent.prototype.connect.calledOnce, 'State components was not connected to the view');
					assert.isFalse(AView.prototype.setControl.called, 'Control component should not be set when the state hasn\'t  control component');
					assert.isFalse(AControl.prototype.setView.called, 'View component should not be set to the control component when the state hasn\'t control component');
				});

				test('with control', function(){
					assert.doesNotThrow(function(){
						stateWithViewControl.setModel({});
						stateWithViewControl.connect();
					});

					assert.isTrue(AView.prototype.setControl.calledOnce, 'Control component was not set to the view component');
					assert.isTrue(AControl.prototype.setView.calledOnce, 'View component was not set to the view component');

					assert.isTrue(AStateComponent.prototype.connect.calledTwice, 'State components was not connected to the view and control components');
					assert.isTrue(AStateComponent.prototype.connect.calledAfter(AView.prototype.setControl), 'State components should be connected after setupping of the control component to the view component');
					assert.isTrue(AStateComponent.prototype.connect.calledAfter(AControl.prototype.setView), 'State components should be connected after setupping of the view component to the control component');
				});

				test('execute twice', function(){
					assert.doesNotThrow(function(){
						stateWithView.setModel({});

						stateWithView.connect();
						stateWithView.connect();
					});

					assert.isTrue(AStateComponent.prototype.connect.calledOnce, 'State components should be connected only one time');
				});
			});
		});
	} );
});
