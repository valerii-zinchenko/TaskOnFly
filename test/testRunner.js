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
	'utils',
	'aclass'
], function() {
	requirejs([
		'class',
		'singleton',
		'AStateComponent',
		'aview',
		'acontrol',
		'astate',
		'mvcmodule',
		'EventHandler',

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
		//requirejs(['main'], function(){
			mocha.run();
		//});
	});
});
