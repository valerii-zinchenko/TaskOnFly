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

suite('HashRouter', function() {
	var router;
	suite('Constructor', function() {
		suite('incorrect type of routingMap', function() {
			setup(function(){
				HashRouter.instance = null;
			});

			test('undefined', function() {
				assert.throw(function() {
					new HashRouter();
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
			test('null', function() {
				assert.throw(function() {
					new HashRouter(null);
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
			test('boolean', function() {
				assert.throw(function() {
					new HashRouter(true);
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
			test('Number', function() {
				assert.throw(function() {
					new HashRouter(0);
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
			test('String', function() {
				assert.throw(function() {
					new HashRouter('');
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
			test('Array', function() {
				assert.throw(function() {
					new HashRouter([]);
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
			test('Function', function() {
				assert.throw(function() {
					new HashRouter(function(){});
				}, Error, 'Type of routingMap input argument expected to be an Object');
			});
		});

		suite('incorrect type of context', function() {
			setup(function(){
				HashRouter.instance = null;
			});

			test('undefined', function() {
				assert.throw(function() {
					new HashRouter({});
				}, Error, 'Type of context input argument expected to be an Object');
			});
			test('null', function() {
				assert.throw(function() {
					new HashRouter({}, null);
				}, Error, 'Type of context input argument expected to be an Object');
			});
			test('boolean', function() {
				assert.throw(function() {
					new HashRouter({}, false);
				}, Error, 'Type of context input argument expected to be an Object');
			});
			test('Number', function() {
				assert.throw(function() {
					new HashRouter({}, 0);
				}, Error, 'Type of context input argument expected to be an Object');
			});
			test('String', function() {
				assert.throw(function() {
					new HashRouter({}, '');
				}, Error, 'Type of context input argument expected to be an Object');
			});
			test('Array', function() {
				assert.throw(function() {
					new HashRouter({}, []);
				}, Error, 'Type of context input argument expected to be an Object');
			});
			test('Function', function() {
				assert.throw(function() {
					new HashRouter({}, function(){});
				}, Error, 'Type of context input argument expected to be an Object');
			});
		});

		suite('initialize', function() {
			setup(function(){
				HashRouter.instance = null;
			});

			test('_routingMap', function(){
				assert.doesNotThrow(function() {
					router = new HashRouter({
						'route1': ['method1', 'method2'],
						'route2': 'method'
					}, {});
				});

				assert.property(router._routingMap, 'route1', 'Route map object for route "route1" was incorrectly created');
				assert.property(router._routingMap, 'route2', 'Route map object for route "route2" was incorrectly created');

				assert.isArray(router._routingMap.route1.methods, '"methods" map property for route "route1" should be an array');
				assert.instanceOf(router._routingMap.route1.regExp, RegExp, '"regExp" map property for route "route1" should be a RegExp');

				assert.isArray(router._routingMap.route2.methods, '"methods" map property for route "route2" should be an array');
				assert.instanceOf(router._routingMap.route2.regExp, RegExp, '"regExp" map property for route "route2" should be a RegExp');
			});

			test('context without prefix', function() {
				assert.doesNotThrow(function(){
					router = new HashRouter({}, {});
				});
				assert.equal('', router._context.prefix, 'Prefix should be reset into empty string');
			});

			test('context with prefix', function(){
				var prefix = '!';
				assert.doesNotThrow(function(){
					router = new HashRouter({}, {
						prefix: prefix
					});
				});
				assert.equal(prefix, router._context.prefix, 'Prefix should not be changed');
			});
		});
	});

	suite('Methods', function() {
		setup(function() {
			router = new HashRouter({}, {});
		});
		teardown(function() {
			router.constructor.instance = null;
		});

		suite('start', function(){
			setup(function(){
				sinon.stub(router, '_hashChange', function(){});
				sinon.stub(router, '_getHash', function(){});
				sinon.stub(router, '_getQuery', function(){});
			});
			teardown(function(){
				router._hashChange.restore();
				router._getHash.restore();
				router._getQuery.restore();

				window.onhashchange = function(){};
			});

			test('without start url', function(){
				assert.doesNotThrow(function(){
					router.start();
				});

				assert.isFalse(router._hashChange.called, '_hashChange should not be called');
				assert.isFalse(router._getHash.called, '_getHash should not be called');
				assert.isFalse(router._getQuery.called, '_getQuery should not be called');
			});

			test('with start url', function(){
				var url = 'http://localhost:8080/index.html';
				assert.doesNotThrow(function(){
					router.start(url);
				});

				assert.isTrue(router._hashChange.calledOnce, '_hashChange should be called once');
				assert.isTrue(router._getHash.calledOnce, '_getHash should be called once');
				assert.isTrue(router._getQuery.calledOnce, '_getQuery should be called once');
				assert.equal(url, router._getHash.args[0][0], 'The full unchanged url should be passed in _getHash method');
				assert.equal(url, router._getQuery.args[0][0], 'The full unchanged url should be passed in _getQuery method');
			});

			test('onhashchange', function(){
				var url = 'http://localhost:8080/index.html#hash';
				assert.doesNotThrow(function(){
					router.start();
					window.onhashchange({
						newURL: url
					});
				});

				assert.isTrue(router._hashChange.calledOnce, '_hashChange should be called once');
				assert.isTrue(router._getHash.calledOnce, '_getHash should be called once');
				assert.isTrue(router._getQuery.calledOnce, '_getQuery should be called once');
				assert.equal(url, router._getHash.args[0][0], 'The full unchanged url should be passed in _getHash method');
				assert.equal(url, router._getQuery.args[0][0], 'The full unchanged url should be passed in _getQuery method');
			});
		});

		suite('routeTo', function(){
			setup(function(){
				sinon.spy(router, 'object2Query');
			});
			teardown(function(){
				router.object2Query.restore();
				location.hash = '';
			});

			test('without queries', function(){
				var hash='route';
				assert.doesNotThrow(function(){
					router.routeTo(hash);
				});
				assert.isFalse(router.object2Query.called, 'When object for queries is not specified, object2Query should not be called');
				assert.equal('#'+hash, location.hash, 'Browser\'s hash should be changed');
			});

			test('with queries', function(){
				var hash='route';
				assert.doesNotThrow(function(){
					router.routeTo(hash, {key: 'value'});
				});
				assert.isTrue(router.object2Query.calledOnce, 'object2Query should not be called');
				assert.equal('#'+hash+'?key=value', location.hash, 'Browser\'s hash should be changed');
			});
		});

		suite('back', function(){
			setup(function(){
				router._history.push(0,1,2);

				sinon.stub(window.history, 'back', function(){});
				sinon.stub(router, 'routeTo', function(){});
			});
			teardown(function(){
				window.history.back.restore();
				router.routeTo.restore();
			});

			test('no fallback route', function(){
				assert.doesNotThrow(function(){
					router.back();
					router.back();
					router.back();
				});
				assert.isTrue(window.history.back.calledThrice, 'Native back() should be called without limits');
			});

			test('with fallback route', function(){
				router._fallbackRoute = 'home';

				assert.doesNotThrow(function(){
					router.back();
					router.back();
					router.back();
				});
				assert.isTrue(window.history.back.calledTwice, 'Class of native back() should be limited when the fallbackRoute is defined');
				assert.isTrue(router.routeTo.calledOnce, 'Router should route to some route');
				assert.equal(router._fallbackRoute, router.routeTo.args[0][0], 'Incorrect route is used for fallback routing');
			});
		});

		suite('_getHash', function(){
			[
				{
					url: 'http://localhost:8080/index.html',
					hash: '#'
				},
				{
					url: 'http://localhost:8080/index.html#route',
					hash: '#route'
				},
				{
					url: 'http://localhost:8080/index.html#route?key=value',
					hash: '#route'
				},
				{
					url: 'http://localhost:8080/index.html?key=value#route',
					hash: '#route'
				},
				{
					url: 'http://localhost:8080/index.html#route/path?key=value',
					hash: '#route/path',
					query: '?key=value&key2=value2'
				}
			].forEach(function(testCase) {
				test('url: ' + testCase.url, function() {
					var hash;
					assert.doesNotThrow(function(){
						hash = router._getHash(testCase.url);
					});

					assert.equal(testCase.hash, hash, 'Hash was incorrectly extracted');
				});
			});
		});

		suite('_getQuery', function(){
			[
				{
					url: 'http://localhost:8080/index.html'
				},
				{
					url: 'http://localhost:8080/index.html?key=value',
					query: '?key=value'
				},
				{
					url: 'http://localhost:8080/index.html#route?key=value',
					query: '?key=value'
				},
				{
					url: 'http://localhost:8080/index.html?key=value#route',
					query: '?key=value'
				},
				{
					url: 'http://localhost:8080/index.html?key=value#route?key2=value2',
					query: '?key=value&key2=value2'
				},
				{
					url: 'http://localhost:8080/index.html?&key=value',
					query: '?&key=value'
				},
				{
					url: 'http://localhost:8080/index.html?key=value&',
					query: '?key=value&'
				},
				{
					url: 'http://localhost:8080/index.html?key=value&key2=value2',
					query: '?key=value&key2=value2'
				},
				{
					url: 'http://localhost:8080/index.html?key=value&key2=value2',
					query: '?key=value&key2=value2'
				}
			].forEach(function(testCase) {
				test('url: ' + testCase.url, function() {
					var query;
					assert.doesNotThrow(function(){
						query = router._getQuery(testCase.url);
					});

					assert.equal(testCase.query, query, 'Query was incorrectly extracted');
				});
			});
		});

		suite('_preprocessRouteName', function() {
			['', '!', 'PRFX'].forEach(function(prefix) {
				var rePrefix = prefix ? '(?:'+prefix+')?' : '';

				suite('prefix: "' + prefix + '"', function(){
					test('no convertion required', function() {
						assert.equal('^#' + rePrefix + 'route/?$', router._preprocessRouteName('route', prefix), 'Route without required convertion was incorrectly converted');
						assert.equal('^#' + rePrefix + 'route/path/?$', router._preprocessRouteName('route/path', prefix), 'Route with two constants was incorrectly converted');
					});

					test('convert simple human readeble route variable', function() {
						assert.equal('^#' + rePrefix + 'route/([\\w\\-\\.]+/?)/?$', router._preprocessRouteName('route/:path', prefix), 'Simple human readeble route variable was incorrectly converted');
						assert.equal('^#' + rePrefix + 'route/([\\w\\-\\.]+/?)/([\\w\\-\\.]+/?)/?$', router._preprocessRouteName('route/:path/:path-two', prefix), 'Converting of two human readeble route variables is incorrect');
					});

					test('convert simple RegExp-like route variable', function() {
						assert.equal('^#' + rePrefix + 'route/(\\w+)/?$', router._preprocessRouteName('route/(\\w+)', prefix), 'Simple RegExp-like route was incorrectly converted');
					});
				});
			});
		});

		suite('query2Object', function() {
			[
				{
					query: undefined,
					expected: {}
				},
				{
					query: '?',
					expected: {}
				},
				{
					query: 'key=value',
					expected: {}
				},
				{
					query: '?key=value',
					expected: {"key":"value"}
				},
				{
					query: '?key=value&key2=value2',
					expected: {"key":"value","key2":"value2"}
				},
				{
					query: '?key=&key2=value2',
					expected: {"key":"","key2":"value2"}
				},
				{
					query: '?key=value&',
					expected: {"key":"value"}
				},
				{
					query: '?&key=value',
					expected: {"key":"value"}
				}
			].forEach(function(testCase) {
				test('query: ' + testCase.query, function() {
					var result;
					assert.doesNotThrow(function(){
						result = router.query2Object(testCase.query);
					});
					assert.deepEqual(testCase.expected, result, 'Query was incorrectly converted into the object');
				});
			});
		});

		suite('object2Query', function() {
			test('{}', function() {
				assert.deepEqual('', router.object2Query({}), 'Empty object was incorrectly converted');
			});
			test('{"key":"value"}', function() {
				assert.deepEqual('?key=value', router.object2Query({"key":"value"}), 'Simple with obe key-value pair was incorrectly converted');
			});
			test('{"key":"value","key2":"value2"}', function() {
				assert.deepEqual('?key=value&key2=value2', router.object2Query({"key":"value","key2":"value2"}), 'Object with two key-value pairs were incorrectly converted');
			});
			test('{"key":"","key2":"value2"}', function() {
				assert.deepEqual('?key2=value2', router.object2Query({"key":"","key2":"value2"}), 'Object with two key-value pairs where the key of one pair doesn\'t have a value were incorrectly converted');
			});
		});

		suite('_hashChange', function(){
			suite('local history', function(){
				setup(function(){
					router._history = [];
				});

				test('navigate forward', function(){
					assert.doesNotThrow(function(){
						router._hashChange('route1');
					});
					assert.equal(1, router._history.length, 'New route was not added');
				});

				test('navigate twice forward', function(){
					assert.doesNotThrow(function(){
						router._hashChange('route1');
						router._hashChange('route2');
					});
					assert.equal(2, router._history.length, 'New route was not added');
				});

				test('navigate twice forward and once backward', function(){
					assert.doesNotThrow(function(){
						router._hashChange('route1');
						router._hashChange('route2');
						router._hashChange('route1');
					});
					assert.equal(1, router._history.length, 'Last route was not removed from history');
				});
			});

			suite('detect route and call assigned methods', function(){
				var fn1, fn2;

				setup(function(){
					HashRouter.instance = null;

					fn1 = sinon.spy();
					fn2 = sinon.spy();

					router = new HashRouter({
						'route1': [],
						'route2': ['999'],
						'route3': ['fn1'],
						'route4': ['fn1', 'fn2'],
						'route5/:data': ['fn1'],
						'route6/:data/:id': ['fn1'],
						'route7/\\w+': ['fn1']
					},{
						fn1: fn1,
						fn2: fn2
					});
				});

				test('navigating to not existing route', function(){
					assert.doesNotThrow(function(){
						router._hashChange('#123');
					});
					assert.isFalse(fn1.called, 'fn1 should not be called');
					assert.isFalse(fn2.called, 'fn2 should not be called');
				});

				test('navigating to "route1" but without registered methods', function(){
					assert.doesNotThrow(function(){
						router._hashChange('#route1');
					});
					assert.isFalse(fn1.called, 'fn1 should not be called');
					assert.isFalse(fn2.called, 'fn2 should not be called');
				});

				test('navigating to "route2" with link to not existing method', function(){
					assert.doesNotThrow(function(){
						router._hashChange('#route2');
					});
					assert.isFalse(fn1.called, 'fn1 should not be called');
					assert.isFalse(fn2.called, 'fn2 should not be called');
				});

				test('navigating to "route3" with one registered existing method', function(){
					assert.doesNotThrow(function(){
						router._hashChange('#route3');
					});
					assert.isTrue(fn1.calledOnce, 'fn1 should be called');
					assert.isFalse(fn2.called, 'fn2 should not be called');
				});

				test('navigating to "route4" with two registered existing methods', function(){
					assert.doesNotThrow(function(){
						router._hashChange('#route4');
					});
					assert.isTrue(fn1.calledOnce, 'fn1 should be called');
					assert.isTrue(fn2.calledOnce, 'fn2 should be called');
				});

				test('call method with single path variable', function(){
					var v = 'value';
					assert.doesNotThrow(function(){
						router._hashChange('#route5/'+v);
					});
					assert.isTrue(fn1.calledOnce, 'fn1 should be called');
					assert.equal(2, fn1.args[0].length, 'Incorrect amount of arguments was passed into the function');
					assert.equal(v, fn1.args[0][0], 'incorrect first argument was passed into the function');
					assert.deepEqual({}, fn1.args[0][1], 'incorrect second argument was passed into the function');
				});

				test('call method with two path variable', function(){
					var v1 = 'value1';
					var v2 = 'value2';
					assert.doesNotThrow(function(){
						router._hashChange('#route6/'+v1 + '/' + v2);
					});
					assert.isTrue(fn1.calledOnce, 'fn1 should be called once');
					assert.equal(3, fn1.args[0].length, 'Incorrect amount of arguments was passed into the function');
					assert.equal(v1, fn1.args[0][0], 'incorrect first argument was passed into the function');
					assert.equal(v2, fn1.args[0][1], 'incorrect second argument was passed into the function');
					assert.deepEqual({}, fn1.args[0][2], 'incorrect third argument was passed into the function');
				});

				test('call method with two path variable and query parameters', function(){
					var v1 = 'value1';
					var v2 = 'value2';
					assert.doesNotThrow(function(){
						router._hashChange('#route6/'+v1 + '/' + v2, '?key=value');
					});
					assert.isTrue(fn1.calledOnce, 'fn1 should be called once');
					assert.equal(3, fn1.args[0].length, 'Incorrect amount of arguments was passed into the function');
					assert.equal(v1, fn1.args[0][0], 'incorrect first argument passed into the function');
					assert.equal(v2, fn1.args[0][1], 'incorrect second argument passed into the function');
					assert.deepEqual({key: 'value'}, fn1.args[0][2], 'incorrect third argument was passed into the function');
				});

				test('route pattern without capturing group', function(){
					assert.doesNotThrow(function(){
						router._hashChange('#route7/word');
					});
					assert.isTrue(fn1.calledOnce, 'fn1 should be called once');
					assert.equal(1, fn1.args[0].length, 'Incorrect amount of arguments was passed into the function');
					assert.deepEqual({}, fn1.args[0][0], 'incorrect first argument was passed into the function');
				});
			});
		});
	});
});
