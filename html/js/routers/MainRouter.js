/**
 * Created by valera on 7/18/14.
 */

'use strict';

define(function () {
    function _openView (viewName, fn) {
        requirejs(['js/views/' + viewName], function(View) {
            var view = new View();

            if (fn) {
                fn.call(view);
            }

            $.mobile.changePage('#' + view.page);
            view.render();
        });
    }

    var MainRooter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'home': 'home',
            'task/:action/*path': 'task',
            'list/:action/*path': 'list'
        },

        home: function() {
            _openView('HomeView');
        },
        task: function(action, path) {
            var actionFn = null;

            switch (action) {
                case 'new':
                    actionFn = 'createTask';
                    break;
                case 'view':
                    break;
                default:
                    throw new Error('Unhandled action "' + action + '"');
            }

            if (!path) {
                throw new Error('Path is not defined');
            }

            _openView('TaskView', function() {
                var list = MAIN.TASK_LIST;
                if (path) {
                    path = path.split('/');
                    for (var i = 0, N = path.length; i < N; i++) {
                        list = list[path[i]];
                    }
                }

                this.setItem(list);
                this.setCallback(list[actionFn]);
            });
        },
        list: function(action, path) {
            var actionFn = null;

            switch (action) {
                case 'new':
                    actionFn = 'createSubList';
                    break;
                case 'view':
                    break;
                default:
                    throw new Error('Unhandled action "' + action + '"');
            }

            if (!path) {
                throw new Error('Path is not defined');
            }

            _openView('TaskView', function() {
                var list = MAIN.TASK_LIST;
                if (path) {
                    path = path.split('/');
                    for (var i = 1, N = path.length; i < N; i++) {
                        list = list.models[path[i]];
                    }
                }

                this.setItem(list);
                this.setCallback(list[actionFn]);
            })
        }
    });

    Backbone.history.start();
    return MainRooter;
});