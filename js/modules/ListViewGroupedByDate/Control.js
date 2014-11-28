'use strict';

define([
    '../ListView/Control'
],function(Parent) {
    return new Class(Parent, {
        initialize: function() {
            if (this.list) {
                this.list.setSortingOrder(['isDone', 'date', 'priority']);
            }
        },
        getGroupTitle: function(id) {
            var item = this.list.models[id];
            var title;

            if (item.public.isDone) {
                title = 'done ';
                if (item.public.doneDate) {
                    title += 'at ' + item.public.doneDate;
                }
            } else {
                if (item.public.dueDate) {
                    title = 'till ' + item.public.dueDate;
                } else {
                    title = 'to do';
                }
            }

            return title;
        },
        getGroupID: function(id) {
            var item = this.list.models[id];
            var groupID;

            if (item.public.isDone) {
                groupID = 'true';
                if (item.public.doneDate) {
                    groupID += item.public.doneDate;
                }
            } else {
                groupID = 'false';
                if (item.public.dueDate) {
                    groupID += item.public.dueDate;
                }
            }

            return groupID;
        }
    });
});