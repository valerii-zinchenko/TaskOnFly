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

define(['model/TaskOnFly'], function(Module) {
	suite('TaskOnFly', function() {
		var TaskOnFly;
		setup(function() {
			TaskOnFly = new Module();
		});
		teardown(function(){
			TaskOnFly = null;
			window.localStorage.clear();
		});

		test('setRootList()', function() {
			assert.throw(function() {
				TaskOnFly.setRootList();
			}, Error, 'Invalid list');

			assert.doesNotThrow(function() {
				TaskOnFly.setRootList({});
			});
		});
		test('getRootList()', function() {
			assert.isNull(TaskOnFly.getRootList(), 'Root list should be null after initializing of module');

			var obj = {};
			TaskOnFly.setRootList(obj);
			assert.equal(TaskOnFly.getRootList(), obj, 'Invalid root list is returned');
		});

		test('setCurrentList()', function() {
			assert.throw(function() {
				TaskOnFly.setCurrentList();
			}, Error, 'Invalid list');

			assert.doesNotThrow(function() {
				TaskOnFly.setCurrentList({});
			});
		});
		test('getCurrentList()', function() {
			assert.isNull(TaskOnFly.getCurrentList(), 'Current list should be null after initializing of module');

			var obj = {};
			TaskOnFly.setCurrentList(obj);
			assert.equal(TaskOnFly.getCurrentList(), obj, 'Invalid current list is returned');
		});

		test('changeView()', function() {
			var hash = 'view';
			TaskOnFly.changeView(hash);
			assert.equal(window.location.hash, '#' + hash, 'Browser hash was incorrectly changed');
		});

		suite('back()', function(){
			setup(function(){
				sinon.stub(window.history, 'back');
			});
			teardown(function(){
				window.history.back.restore();
			});

			test('chain', function(){
				assert.doesNotThrow(function(){
					TaskOnFly.back();
				});
				assert.isTrue(window.history.back.calledOnce, 'window.history.back() should be called');
			});
		});

		suite('saveItem()', function(){
			setup(function(){
				sinon.spy(window.localStorage, 'setItem');
			});
			teardown(function(){
				window.localStorage.setItem.restore();
				window.localStorage.clear();
			});

			test('incorrect input arguments', function() {
				assert.throw(function() {
					TaskOnFly.saveItem();
				}, Error, 'Item is not defined');

				assert.throw(function() {
					TaskOnFly.saveItem({});
				}, Error, 'Item object does not contain public object');
				assert.throw(function() {
					TaskOnFly.saveItem({public: 5});
				}, Error, 'Item object does not contain public object');

				assert.throw(function() {
					TaskOnFly.saveItem({public: {}});
				}, Error, 'Item id is not defined');
			});
			test('correct input arguments', function() {
				assert.doesNotThrow(function() {
					TaskOnFly.saveItem({
						public: {
							id: '04',
							value: 11
						}
					});
				});
				assert.isTrue(window.localStorage.setItem.called, 'Saving should redirect to localStorage.setItem()');
				assert.isTrue(window.localStorage.setItem.calledTwice, 'setItem() should be called twice: first to update index; second to save the item data');
			});
			test('update item', function() {
				var item = {
					public: {
						id: '04',
						value: 11
					}
				};
				assert.doesNotThrow(function() {
					TaskOnFly.saveItem(item);
					TaskOnFly.saveItem(item);
				});
			});
		});

		suite('loadItem()', function(){
			setup(function(){
				sinon.spy(window.localStorage, 'getItem');
			});
			teardown(function(){
				window.localStorage.getItem.restore();
			});
			test('incorrect input arguments', function() {
				assert.throw(function() {
					TaskOnFly.loadItem();
				}, Error, 'Item id is not defined');
			});
			test('not existing item', function(){
				var item;
				assert.doesNotThrow(function(){
					item = TaskOnFly.loadItem('item');
				});
				assert.isTrue(window.localStorage.getItem.calledOnce, 'Loading should redirect to localStorage.getItem()');
				assert.isNull(item, 'Null should be returned if item is not exist');
			});
			test('existing item', function(){
				var obj = {
					public: {
						id: '04',
						value: 11
					}
				};
				var item;
				assert.doesNotThrow(function(){
					TaskOnFly.saveItem(obj);

					item = TaskOnFly.loadItem('04');
				});
				assert.isObject(item, 'Object should be returned');
				assert.deepEqual(item, obj.public, 'The content of returned object shoud be the same');
			});
		});

		suite('removeItem()', function(){
			setup(function(){
				sinon.spy(window.localStorage, 'removeItem');
			});
			teardown(function(){
				window.localStorage.removeItem.restore();
			});

			test('without argument', function(){
				assert.doesNotThrow(function(){
					TaskOnFly.removeItem();
				});
			});
			test('not existing item and index of items', function(){
				assert.doesNotThrow(function(){
					TaskOnFly.removeItem('item');
				});
			});
			test('not existing item and with existing index of items', function(){
				assert.doesNotThrow(function(){
					TaskOnFly.saveItem({
						public: {
							id: 'i',
							value: 1
						}
					});
					TaskOnFly.removeItem('item');
				});
				assert.isTrue(window.localStorage.removeItem.calledOnce, 'localStorage.removeItem() should be called');
			});
			test('existing item', function(){
				var item;
				assert.doesNotThrow(function(){
					TaskOnFly.saveItem({
						public: {
							id: 'item',
							value: 1
						}
					});
					TaskOnFly.removeItem('item');
					item = TaskOnFly.loadItem('item');
				});
				assert.isNull(item, 'Item shoud be removed');
			});
		});

		suite('loadAllItems()', function() {
			teardown(function() {
				window.localStorage.clear();
			});
			
			test('no stored items', function(){
				assert.doesNotThrow(function(){
					assert.isNull(TaskOnFly.loadAllItems());
				});
			});

			test('two items', function() {
				var items = [
					{
						public: {
							id: '04',
							value: 11
						}
					},
					{
						public: {
							id: '19',
							value: 90
						}
					}
				];

				var result;
				assert.doesNotThrow(function(){
					TaskOnFly.saveItem(items[0]);
					TaskOnFly.saveItem(items[1]);

					result = TaskOnFly.loadAllItems();
				});

				assert.deepEqual(result[items[0].public.id], items[0].public, 'First item was incorectly loaded');
				assert.deepEqual(result[items[1].public.id], items[1].public, 'Second item was incorectly loaded');
			});
		});
	});
});
