/**
 * Created by Valerii Zinchenko on 7/18/14.
 */

'use strict';

define(function () {
    /**
     *
     * @param {string} viewName View name, that should be opened
     * @param {Function} [fn] Function that calls before rendering of view.
     * @private
     */
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
            'add/:what': 'add',
            'edit/:name': 'edit'
        },

        home: function() {
            _openView('HomeView');
        },

        /**
         *
         * @param {string} what Defines what should be added to the current list. It can be: 'task', 'list'
         */
        add: function(what) {
            switch (what) {
                case 'task':
                case 'list':
                    break;
                default :
                    console.warn('Unknown element name "' + what + '"');
                    return;
            }

            var fn = 'add' + what[0].toUpperCase() + what.slice(1);
            _openView('TaskView', function() {
                var list = TaskMe.getCurrentList();
                this.setSaveCallback(list[fn].bind(list));
            });
        },

        /**
         *
         * @param {string} id Item name in the current list.
         */
        edit: function(id) {
            _openView('TaskView', function() {
                var list = TaskMe.getCurrentList(),
                    item = list.getItem(id);

                if (!item) {
                    throw new Error('Item with id: "' + id + '" was not found');
                }

                this.setItem(item);
                this.setSaveCallback(list.saveData.bind(item));
            });
        }
    });

    return MainRooter;
});