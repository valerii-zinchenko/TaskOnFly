/**
 * Created by valera on 7/18/14.
 */
define([
    'backbone'
],function () {
    function _openView (viewName, fn) {
        requirejs(['js/views/' + viewName], function(View) {
            var view = new View();
            view.render();

            if (fn) {
                fn();
            }
        });
    }

    var MainRooter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'home': 'home',
            'addTask': 'addTask'
        },

        home: function() {
            _openView('HomeView');
        },
        addTask: function() {
            _openView('TaskView');
        }
    });

    Backbone.history.start();
    return MainRooter;
});