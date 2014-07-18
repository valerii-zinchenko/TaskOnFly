/**
 * Created by valera on 7/18/14.
 */
define([
    'backbone'
],function () {
    function _openView (viewName) {
        requirejs(['js/views/' + viewName], function(View) {
            new View();
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
            _openView('AddTask');
        }
    });

    Backbone.history.start();
    return MainRooter;
});