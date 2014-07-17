/**
 * Created by valera on 7/14/14.
 */

requirejs.config({
    baseUrl: '../js',
    path: {
        'jquery':           'lib/jquery-2.1.1',
        'jquery.mobile':    'lib/jquery.mobile-2.1.1',
        'underscore':       'lib/underscore-1.6.0',
        'backbone':         'lib/backbone-1.1.2',
        'backbone.validation':      'lib/backbone-validation-amd-0.9.1',
        'backbone.localStorage':    'lib/backbone.localStorage-1.1.9',
        'text':             'lib/text-2.0.12',
        'i18n':             'i18n-2.0.4'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        'jquery.mobile': {
            deps: ['jquery'],
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery.mobile', 'underscore'],
            exports: 'Backbone'
        },
        'backbone.validation': {
            deps: ['backbone']
        }
    }
});

requirejs(["views/HomeView"]);
