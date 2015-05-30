var require = {
    paths: {
        'jquery':           '../3rd-party/jquery',
		'bootstrap':		'../3rd-party/bootstrap',
        'underscore':       '../3rd-party/underscore',
        'backbone':         '../3rd-party/backbone',

        'taskonfly':        'model/TaskOnFly',

        'aclass':           'core/AClass',
        'class':            'core/Class',
        'utils':            'core/utils',
        'singleton':        'core/SingletonClass',
		'EventHandler':		'core/EventHandler',
		'AStateComponent':	'core/AStateComponent',
		'astate':			'core/AState',
		'aview':			'core/AView',
		'acontrol':			'core/AControl',
        'mvcmodule':        'core/MVCModule'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'utils': {
            exports: 'utils'
        },
        'aclass': {
            exports: 'aclass'
        },
        'class': {
            exports: 'Class'
        },
        'singleton': {
            exports: 'Singleton'
        },
		'EventHandler': {
			deps: ['class']
		},
		AStateComponent: {
			deps: ['class']
		},
		astate: {
			deps: ['AStateComponent']
		},
		'aview': {
			deps: ['class']
		},
		'acontrol': {
			deps: ['class']
		},
        'mvcmodule': {
            epxorts: 'MVCModule'
        },
		'taskonfly': {
			deps: ['class', 'EventHandler']
		}
    },
	deps: ['jquery', 'bootstrap', 'underscore', 'backbone']
};

