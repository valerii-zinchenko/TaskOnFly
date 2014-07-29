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
            'view/:path' : 'view',
            'add/:item/*path': 'add'
        },

        home: function() {
            _openView('HomeView');
        },
        add: function(item, path) {
            var actionFn = null;

            switch (item) {
                case 'task':
                    actionFn = 'addTask';
                    break;
                case 'list':
                    actionFn = 'addSubList';
                    break;
                default:
                    throw new Error('Unhandled item "' + item + '"');
            }

            if (!path) {
                throw new Error('Path is not defined');
            }

            path = path.split('/');

            _openView('TaskView', function() {
                var list = MAIN.TASK_LIST,
                    item;

                for (var i = 1, N = path.length; i < N; i++) {
                    list = list.models[path[i]];
                }

                item = list[actionFn]();

                this.setItem(item);
                this.setCallback(list.saveData);
            });
        },
        view: function(path) {
            var viewName,
                itemName;

            if (!path) {
                throw new Error('Path is not defined');
            }

            path = path.split('/');
            itemName = path.pop();

            switch (itemName[0]) {
                case 'T':
                    viewName = 'TaskView';
                    break;
                case 'L':
                    viewName = 'ListView';
                    break;
                default :
                    throw new Error('Unhandled item "' + itemName[0] + '"');
            }

            _openView(viewName, function() {
                var list = MAIN.TASK_LIST,
                    item;

                for (var i = 1, N = path.length; i < N; i++) {
                    list = list.models[path[i]];
                }

                item = list.getItem(itemName);

                this.setItem(item);
                this.setCallback(list.saveData);
            })
        }
    });

    Backbone.history.start();
    return MainRooter;
});