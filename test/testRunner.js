window.assert = chai.assert;
window.sinon = sinon;

mocha.setup({
	ui: 'tdd',
	bail: false
});

requirejs([
	'./core/test_utils.js',
	'./core/testAClass.js',
	'./core/testClass.js',
	'./core/testSingletonClass.js',
	'./core/testAStateComponent.js',
	'./core/testAControl.js',
	'./core/testAView.js',
	'./core/testAState.js',
	'./core/testMVCModule.js',
	'./core/testEventHandler.js',
	'./core/testHashRouter.js'
], function() {
	requirejs([
		'../js/modules/AItem/Model',
		//'../js/model/TaskOnFly',

		'./modules/AItem/testModel.js'
		//'./model/testTaskOnFly.js'
	], function() {
	//requirejs(['main'], function(){
		mocha.run();
	//});
	});
});
