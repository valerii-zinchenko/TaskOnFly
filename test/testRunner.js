window.assert = chai.assert;
window.sinon = sinon;

var TaskManager = {
    Pages: {},
    Modules: {}
};

mocha.setup({
	ui: 'tdd',
	bail: false
});

requirejs([
	'../js/libs',
	'../js/core/utils',
	'../js/core/AClass'
], function() {
	requirejs([
		'../js/core/Class',
		'../js/core/SingletonClass',
		'../js/core/AStateComponent',
		'../js/core/AView',
		'../js/core/AControl',
		'../js/core/AState',
		'../js/core/MVCModule',
		'../js/core/EventHandler',

		'./core/test_utils.js',
		'./core/testAClass.js',
		'./core/testClass.js',
		'./core/testSingletonClass.js',
		'./core/testAStateComponent.js',
		'./core/testAControl.js',
		'./core/testAView.js',
		'./core/testAState.js',
		'./core/testMVCModule.js',
		'./core/testEventHandler.js'
	], function() {
		requirejs([
			'../js/model/TaskOnFly',

			'./model/testTaskOnFly.js'
		], function() {
		//requirejs(['main'], function(){
			mocha.run();
		//});
		});
	});
});
