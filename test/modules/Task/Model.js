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


define([
	'modules/Task/Model',
	'modules/AItem/Model'
], function(Module, Parent){
	function createStorageStub() {
		return {
			loadItem: sinon.spy(),
			loadAll: sinon.spy(),
			saveItem: sinon.spy(),
			removeItem: sinon.spy()
		}
	}

	suite('Task.Model', function() {
		suite('Constructor', function() {
			var storage;
			setup(function() {
				storage = createStorageStub();
				sinon.stub(Module.prototype, 'upgrade', function(){});
				sinon.stub(Module.prototype, 'saveData', function(){});
			});
			teardown(function(){
				storage = null;
				Module.prototype.upgrade.restore();
				Module.prototype.saveData.restore();
			});

			test('inheritance', function(){
				assert.instanceOf(Module.prototype, Parent, 'Parent was changed');
			});

			test('without all/some arguments', function() {
				assert.throw(function() {
					new Module();
				}, Error, 'Invalid input arguments');
				assert.throw(function() {
					new Module(null);
				}, Error, 'Invalid input arguments');
				assert.throw(function() {
					new Module(null, null);
				}, Error, 'Invalid input arguments');
				assert.throw(function() {
					new Module(null, null, null);
				}, Error, 'Incorrect type of "data" argument');
			});

			test('incorrect type of "data" argument', function() {
				[undefined, null, true, 1, 'str', [], function(){}].forEach(function(input){
					assert.throw(function() {
						new Module(input, null, null);
					}, Error, 'Incorrect type of "data" argument');
				});
			});

			test('incorrect type of "version" argument', function() {
				[undefined, null, true, 1, {}, [], function(){}].forEach(function(input){
					assert.throw(function() {
						new Module({}, input, null);
					}, Error, 'Incorrect type of "version" argument');
				});
			});

			test('incorrect type of "storages" argument', function() {
				[undefined, null, true, 1, {}, 'str', function(){}].forEach(function(input){
					assert.throw(function() {
						new Module({}, '1', input);
					}, Error, 'Incorrect type of "storages" argument');
				});
			});

			test('with correct arguments type', function() {
				var data = {};
				assert.doesNotThrow(function(){
					new Module(data, '0.0.0', [storage]);
				});

				assert.isTrue(Module.prototype.saveData.calledOnce, 'Model should be saved after creating');
				assert.equal(Module.prototype.saveData.args[0][0], data, 'Incorrect data object was tried to save in storages');
			});

			suite('auto upgrading', function(){
				test('undefined -> 0.0.0', function() {
					var data = {};
					var version = '0.0.0';

					assert.doesNotThrow(function(){
						new Module(data, version, [storage]);
					});

					assert.equal(data.version, version, 'Model should always contain some version, even when new version is \'0.0.0\'');
					assert.isFalse(Module.prototype.upgrade.called, 'upgrade() should not be called, when the model version and new version are both the lowset possible');
				});

				test('undefined -> 1.0.0', function() {
					var data = {};
					var version = '1.0.0';

					assert.doesNotThrow(function(){
						new Module(data, version, [storage]);
					});

					assert.equal(data.version, version, 'Undefined model version should be upgraded to the new verison');
					assert.isTrue(Module.prototype.upgrade.called, 'upgrade() should be called');
				});

				test('0.0.1 -> 1.0.0', function() {
					var data = {version: '0.0.1'};
					var version = '1.0.0';

					assert.doesNotThrow(function(){
						new Module(data, version, [storage]);
					});

					assert.equal(data.version, version, 'Data object with lower version than new shuold be upgraded to the new version');
					assert.isTrue(Module.prototype.upgrade.called, 'upgrade() should be called');
				});

				test('0.10.0  -> 0.0.2', function() {
					var data = {version: '0.10.0'};
					var version = '0.0.2';

					assert.doesNotThrow(function(){
						new Module(data, version, [storage]);
					});

					assert.notEqual(data.version, version, 'Data object with higher version than new shuold not be upgraded to the new version');
					assert.isFalse(Module.prototype.upgrade.called, 'upgrade() should not be called, when the model version is higher than new version');
				});

				test('order of called upgrade() and saveData()', function() {
					var data = {version: '0.0.1'};
					var version = '0.0.2';

					assert.doesNotThrow(function(){
						new Module(data, version, [storage]);
					});

					assert.isTrue(Module.prototype.saveData.calledAfter(Module.prototype.upgrade), 'Model data should be saved after upgraing');
				});
			});

			test('Is Module a singleton?', function() {
				assert.notEqual(new Module({}, '1', []), new Module({}, '1', []), 'Module should not be a singleton');
			});
		});

		suite('Methods', function(){
			var storage;
			var task;
			setup(function(){
				storage = createStorageStub();
				task = new Module({
					isDone: false
				}, '1.0.0', [storage]);

				sinon.stub(task, 'trigger', function(){});
				sinon.spy(Parent.prototype, 'destruct');
			});
			teardown(function(){
				task.trigger.restore();
				Parent.prototype.destruct.restore();

				task = null;
				storage = null;
			});

			test('destruct()', function(){
				var id = task.public.id;
				
				assert.doesNotThrow(function(){
					task.destruct();
				});
				assert.isTrue(storage.removeItem.calledOnce, 'Item should be removed from all storages');
				assert.equal(storage.removeItem.args[0][0], id, 'Item ID should be passed to storage\'s method for removing');
				assert.isTrue(Parent.prototype.destruct.calledOnce, 'Parent destruct() should be called');
			});

			suite('saveData()', function() {
				setup(function(){
					task.trigger.reset();
					sinon.stub(task, 'triggerEvents');
				});
				teardown(function(){
					task.triggerEvents.restore();
				});

				test('no data', function(){
					assert.doesNotThrow(function(){
						task.saveData();
					});
					assert.equal(task.public.isDone, false, 'Model properties should not be changed');
					assert.isFalse(task.triggerEvents.called, 'No property specific event should be triggered if no data for update');
					assert.isFalse(task.trigger.called, 'Nothing should be triggered if no data for update');
					assert.isFalse(storage.removeItem.called, 'Mothing should be stored if no data for update');
				});

				test('same data', function(){
					assert.doesNotThrow(function(){
						task.saveData({
							isDone: task.public.isDone
						});
					});
					assert.equal(task.public.isDone, false, 'Model properties should not be changed');
					assert.isFalse(task.triggerEvents.called, 'No property specific event should be triggered if no data for update');
					assert.isFalse(task.trigger.called, 'Nothing should be triggered if no data for update');
					assert.isFalse(storage.removeItem.called, 'Mothing should be stored if no data for update');
				});

				test('new data', function(){
					var data = {
						title: 'I am an item'
					};

					assert.doesNotThrow(function(){
						task.saveData(data);
					});

					assert.equal(task.public.title, data.title, 'New property was incorrectly set to the model');
					assert.isTrue(task.triggerEvents.calledOnce, 'Property specific events should be triggered');
					assert.equal(task.triggerEvents.args[0][0], data, 'Events for properties that in data object exist should be triggered');
					assert.isTrue(task.trigger.calledOnce, 'General event should be triggered');
					assert.equal(task.trigger.args[0][0], 'update', 'General \'update\' event should be triggered');
				});
			});

			suite('toggleStatus()', function() {
				setup(function(){
					task.trigger.reset();
					sinon.stub(task, 'saveData');
					sinon.spy(Parent.prototype, 'toggleStatus');
				});
				teardown(function(){
					task.saveData.restore();
					Parent.prototype.toggleStatus.restore();
				});

				test('spy', function() {
					assert.doesNotThrow(function(){
						task.toggleStatus();
					});

					assert.equal(task.saveData.args[0][0].isDone, true, 'isDone property was not changed');
					assert.equal(task.saveData.args[0][0].doneDate, new Date().toISOString().slice(0,10), 'doneDate property was incorrectly set');
					assert.isTrue(Parent.prototype.toggleStatus.calledOnce, 'Parent toggleStatus() should be called');
				});
			});

			suite('upgrade()', function(){
				setup(function(){
					sinon.stub(task.versionUpgrades, '1.0.9', function(){});
				});
				teardown(function(){
					task.versionUpgrades['1.0.9'].restore();
				});

				test('upgrade model', function(){
					var data = {version: '0.0.0'};
					assert.doesNotThrow(function(){
						task.upgrade(data);
					});

					assert.isTrue(task.versionUpgrades['1.0.9'].calledOnce, 'Upgrade was not executed');
					assert.equal(task.versionUpgrades['1.0.9'].args[0][0], data, 'Incorrect data object was not passed for the upgrade');
				});

				test('do not upgrade model', function(){
					assert.doesNotThrow(function(){
						task.upgrade({version: '9999.0.0'});
					});

					assert.isFalse(task.versionUpgrades['1.0.9'].called, 'Upgrade should not be executed');
				});
			});

			suite('versionUpgrades["1.0.9"]', function(){
				test('data.priority: 0 -> 2', function(){
					var data = {priority: 0};

					assert.doesNotThrow(function(){
						task.versionUpgrades['1.0.9'](data);
					});
					assert.equal(data.priority, 2, 'Priority should be changed to 2');
				});
				test('data.priority: 2 -> 0', function(){
					var data = {priority: 2};

					assert.doesNotThrow(function(){
						task.versionUpgrades['1.0.9'](data);
					});
					assert.equal(data.priority, 0, 'Priority should be changed to 0');
				});
			});
		});
	});
});
