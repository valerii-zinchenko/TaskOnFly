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
            if (this.public.items.indexOf(item.public.id) === -1) {
                this.public.items.push(item.public.id);
            }

            this.models[item.public.id] = item;

            TaskMe.saveItem(this);
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
            TaskMe.removeItem(id);
            this.public.items.splice(this.public.items.indexOf(id), 1);
            delete this.models[id];

            TaskMe.saveItem(this);
        },

        selectList: function(id) {
            var list = this.getItem(id);
            TaskMe.setCurrentList(list);
            TaskMe.getCurrentList()._parent = this;

            return list;
        },
        selectParentList: function() {
            TaskMe.setCurrentList(this._parent);

            return this._parent;
        }
    });

    TaskList._counter = 0;

    return TaskList;
});