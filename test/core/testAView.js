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

suite('AView', function() {
	suite('Constructor', function(){
		test('Inheritance', function(){
			assert.instanceOf(AView.prototype, AStateComponent, 'AView should be inherited from AStateComponent');
		});

		test('initialize()', function(){
			assert.doesNotThrow(function(){
				new AView();
			});
		});
	});

	suite('Methods', function(){
		var aView;
		setup(function(){
			aView = new AView();
			sinon.spy(AStateComponent.prototype, "destruct");
		});
		teardown(function(){
			aView = null;
			AStateComponent.prototype.destruct.restore();
		});

		suite('setView()', function(){
			test('incorrect view instance', function(){
				assert.throw(function(){
					aView.setControl({});
				}, Error, 'Incorrect type of control component');
			});

			test('correct view instance', function(){
				var control = new AControl();
				assert.doesNotThrow(function(){
					aView.setControl(control);
				});
				assert.equal(aView.control, control, 'Control was incorrectly set');
			});
		});

		test('desctuct()', function(){
			assert.doesNotThrow(function(){
				aView.setControl(new AControl());
				aView.destruct();
			});

			assert.isNull(aView.control, 'destruct() should set view to null');
			assert.isTrue(AStateComponent.prototype.destruct.calledOnce, 'Parent\'s destruct() should be called');
		});

		suite('render()', function(){
			setup(function(){
				sinon.spy(AView.prototype, 'processTemplate');
				sinon.spy(AView.prototype, '_postProcessTemplate');
				sinon.spy(AView.prototype, 'renderSubModules');
			});
			teardown(function(){
				AView.prototype.processTemplate.restore();
				AView.prototype._postProcessTemplate.restore();
				AView.prototype.renderSubModules.restore();
			});

			test('without model', function(){
				assert.throw(function(){
					aView.render();
				}, Error, 'Model is not connected');
			});

			test('first call with model', function(){
				assert.doesNotThrow(function(){
					aView.setModel({});
					aView.render();
				});

				assert.isTrue(AView.prototype.processTemplate.called, 'processTemplate() should be called inside of render()');
				assert.isTrue(AView.prototype._postProcessTemplate.called, '_postProcessTemplate() should be called inside of render()');
				assert.isTrue(AView.prototype.renderSubModules.called, 'renderSubModules() should be called inside of render()');
			});
		});

		suite('postRender()', function(){
			setup(function(){
				sinon.spy(AView.prototype, '_postRender');
				sinon.spy(AView.prototype, '_attachEvents');
				sinon.spy(AView.prototype, '_postRenderModules');
			});
			teardown(function(){
				AView.prototype._postRender.restore();
				AView.prototype._attachEvents.restore();
				AView.prototype._postRenderModules.restore();
			});

			test('execute', function(){
				assert.doesNotThrow(function(){
					aView.postRender();
				});
				assert.isTrue(aView._postRender.called, '_postRender() should be called inside of postRender()');
				assert.isTrue(aView._attachEvents.called, '_attachEvents() should be called inside of postRender()');
				assert.isTrue(aView._postRenderModules.called, '_postRenderModules() should be called inside of postRender()');
			});
		});

		suite('execute render(), postRender(), render() and postRender()', function() {
			setup(function(){
				sinon.spy(AView.prototype, 'processTemplate');
				sinon.spy(AView.prototype, '_postProcessTemplate');
				sinon.spy(AView.prototype, 'renderSubModules');
				sinon.spy(AView.prototype, '_postRender');
				sinon.spy(AView.prototype, '_attachEvents');
				sinon.spy(AView.prototype, '_postRenderModules');
			});
			teardown(function(){
				AView.prototype.processTemplate.restore();
				AView.prototype._postProcessTemplate.restore();
				AView.prototype.renderSubModules.restore();
				AView.prototype._postRender.restore();
				AView.prototype._attachEvents.restore();
				AView.prototype._postRenderModules.restore();
			});

			test('execute chain', function(){
				assert.doesNotThrow(function(){
					aView.setModel(new AView());
					aView.render();
					aView.postRender();
					aView.render();
					aView.postRender();
				});

				assert.isTrue(aView._postRender.calledOnce, '_postRender() should be called once by execution render(), postRender(), render() and postRender()');
				assert.isTrue(aView._attachEvents.calledOnce, '_attachEvents() should be called once by execution render(), postRender(), render() and postRender()');
				assert.isTrue(aView._postRenderModules.calledOnce, '_postRenderModules() should be called once by execution render(), postRender(), render() and postRender()');
				assert.isTrue(aView._postRender.calledOnce, '_postRender() should be called once by execution render(), postRender(), render() and postRender()');
				assert.isTrue(aView._attachEvents.calledOnce, '_attachEvents() should be called once by execution render(), postRender(), render() and postRender()');
				assert.isTrue(aView._postRenderModules.calledOnce, '_postRenderModules() should be called once by execution render(), postRender(), render() and postRender()');
			});
		});

		test('update()', function() {
			assert.doesNotThrow(function(){
				aView.update();
			});
		});

		test('updateSubModules()', function() {
			assert.doesNotThrow(function(){
				aView.updateSubModules();
			});
		});
	});
});
