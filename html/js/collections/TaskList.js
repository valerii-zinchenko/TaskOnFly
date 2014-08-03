/**
 * Created by Valerii Zinchenko on 7/17/14.
 */

'use strict';

define([
    'js/models/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _parent: null,
        models: {},

        public: {
            type: 'List',
            items: []
        },

        _add: function(item) {
            this.models[item.public.id] = item;
            this.public.items.push(item.public.id);

            return item;
        },
        addTask: function(data) {
            return this._add(new Task(this.public.id, data));
        },
        addList: function(data) {
            return this._add(new TaskList(this.public.id, data));
        },

        getItem: function(id) {
            return this.models[id];
        },

        removeItem: function(id) {
            TaskMe.removeItem(this.models[id]);
            this.public.items.splice(this.public.items.indexOf(id), 1);
            delete this.models[id];
        },

        selectList: function(id) {
            TaskMe.setCurrentList(this.getItem(id));
            TaskMe.getCurrentList()._parent = this;
        },
        selectParentList: function() {
            TaskMe.setCurrentList(this._parent);
        }
    });

    TaskList._counter = 0;

    return TaskList;
});