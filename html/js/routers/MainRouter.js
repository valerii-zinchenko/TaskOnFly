/**
 * Created by valera on 7/18/14.
 */
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
            'task': 'task',
            'task/:listInd': 'task',
            'task/:listInd/:taskInd': 'task',
            'list/new/*path': 'list',
            'list/view/*path': 'list'
        },

        home: function() {
            _openView('HomeView');
        },
        task: function(listInd, taskInd) {
            _openView('TaskView', function() {
                var list = MAIN.TASK_LIST,
                    task;

                if (listInd) {
                    list = MAIN.TASK_LIST[listInd];
                }
                if (taskInd) {
                    task = list.models[taskInd];
                }

                this.setList(list);
                this.setTask(task);
            });
        },
        list: function(action, path) {
            _openView('TaskView', function() {
                var list = MAIN.TASK_LIST;
                if (path) {
                    path = path.split('/');
                    for (var i = 0, N = path.length; i < N; i++) {
                        list = list[path[i]];
                    }
                }

                if (action === 'new') {
                    list.createSubList();
                }
            })
        }
    });

    Backbone.history.start();
    return MainRooter;
});