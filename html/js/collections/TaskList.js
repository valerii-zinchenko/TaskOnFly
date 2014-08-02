/**
 * Created by Valerii Zinchenko on 7/17/14.
 */

'use strict';

define([
    'js/models/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _type: 'list',
        _parent: null,
        models: {},
        length: 0,

        _add: function(item) {
            this.models[item.public.id] = item;
            this.length++;

            return item;
        },
        addList: function(data) {
            return this._add(new TaskList(this.public.id, data));
        },
        addTask: function(data) {
            return this._add(new Task(this.public.id, data));
        },

        getItem: function(name) {
            return this.models[name];
        },

        selectList: function(name) {
            TaskMe.setCurrentList(this.getItem(name));
            TaskMe.getCurrentList()._parent = this;
        },
        selectParentList: function() {
            TaskMe.setCurrentList(this._parent);
        }
    });

    TaskList._counter = 0;

    return TaskList;
});