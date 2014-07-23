/**
 * Created by valera on 7/14/14.
 */

requirejs.config({
    baseUrl: '.',
    paths: {
        'jquery':           'js/lib/jquery-2.1.1',
        'jquery.mobile':    'js/lib/jquery.mobile-1.4.3',
        'underscore':       'js/lib/underscore-1.6.0',
        'backbone':         'js/lib/backbone-1.1.2',
        'text':             'js/lib/text-2.0.12',
        'i18n':             'js/lib/i18n-2.0.4'
    },
    shim: {
        jquery: {
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
        }
    },
    deps: ['jquery.mobile', 'backbone', 'js/main']
});