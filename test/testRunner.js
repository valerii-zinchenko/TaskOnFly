window.assert = chai.assert;
window.sinon = sinon;

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
		//'astate',
		'./core/test_utils.js',
		'./core/testAClass.js',
		'./core/testClass.js',
		'./core/testSingletonClass.js',
		'./core/testAStateComponent.js',
		'./core/testAControl.js',
		'./core/testAView.js',
		//'./core/testMVCModule.js'
	], function() {
		mocha.run();
	});
});
