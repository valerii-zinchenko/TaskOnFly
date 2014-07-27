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
            var actionFN = null;

            switch (action) {
                case 'new':
                    actionFN = 'createTask';
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
                var list = MAIN.TASK_LIST,
                    task;

                if (path) {
                    path = path.split('/');
                    for (var i = 0, N = path.length; i < N; i++) {
                        list = list[path[i]];
                    }
                }

                if (action) {
                    list[action]()
                }

                if (taskInd) {
                    task = list.models[taskInd];
                }

                this.setList(list);
                this.setTask(task);
            });
        },
        list: function(action, path) {
            var actionFN = null;

            switch (action) {
                case 'new':
                    actionFN = 'createSubList';
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

                if (action) {
                    list[action]()
                }
            })
        }
    });

    Backbone.history.start();
    return MainRooter;
});