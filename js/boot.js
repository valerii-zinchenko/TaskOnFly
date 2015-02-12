/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

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

var TaskManager = {
    version: '1.0.9',
    Pages: {},
    Modules: {}
};

requirejs.config({
    paths: {
        'jquery':           'lib/jquery-2.1.1',
        'jquery.mobile':    'lib/jquery.mobile-1.4.3',
        'underscore':       'lib/underscore-1.6.0',
        'backbone':         'lib/backbone-1.1.2',
        'text':             'lib/text-2.0.12',
        'i18n':             'lib/i18n-2.0.4',
        'taskonfly':        'model/TaskOnFly',
        'aclass':           'core/AClass',
        'class':            'core/Class',
        'utils':            'core/utils',
        'singleton':        'core/SingletonClass',
		'EventHandler':		'core/EventHandler',
		'aview':			'core/AView',
		'acontrol':			'core/AControl',
        'mvcmodule':        'core/MVCModule'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'jquery.mobile': {
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
		'aview': {
			deps: ['class']
		},
		'acontrol': {
			deps: ['class']
		},
        'mvcmodule': {
            epxorts: 'MVCModule'
        }
    }
});

requirejs([
    'jquery',
    'backbone',
    'utils',
    'aclass'
], function() {
    requirejs([
        'class',
        'singleton',
		'EventHandler',
		'aview',
		'acontrol',
        'mvcmodule',
        'taskonfly'
    ], function() {
        $(document).on('mobileinit', function() {
            $.extend($.mobile, {
                ajaxEnabled: false,
                linkBindingEnabled: false,
                hashListeningEnabled: false
            });
        });

        requirejs(['jquery.mobile'], function() {
            requirejs(['main'], function(main) {
                main();
                Backbone.history.start();

                requirejs([
                    'model/MainRouter',

                    'modules/Task',
                    'modules/TaskList',
                    /*'modules/ListView',
                    'modules/MainPanel',
                    'modules/SimpleSearch',*/

                    //'pages/About',
                    'pages/Home',
                    //'pages/ItemEditor',

                    'view/PopupDialog'
                ]);
            });
        });
    });
});
