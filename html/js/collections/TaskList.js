/**
 * Created by valera on 7/17/14.
 */

'use strict';

define([
    'js/models/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _pathPrefix: 'L',
        _type: 'list',
        _parent: null,
        models: {},
        length: 0,

        addList: function(data) {
            var list = new TaskList(this.public.path, data);
            this.models[list._name] = list;
            this.length++;

            return list;
        },
        addTask: function(data) {
            var task = new Task(this.public.path, data);
            this.models[task._name] = task;
            this.length++;

            return task;
        },

        getItem: function(name) {
            return this.models[name];
        },

        selectList: function(name) {
            var parent = MAIN.CURRENT_LIST;
            MAIN.CURRENT_LIST = parent.getItem(name);
            MAIN.CURRENT_LIST._parent = parent;
        },
        selectParentList: function() {
            MAIN.CURRENT_LIST = this._parent;
        }
    });

    TaskList._counter = 0;

    return TaskList;
});