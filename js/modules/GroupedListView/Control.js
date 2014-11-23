'use strict';

define([
    '../ListView/Control'
], function (Parent) {
    return new Class(Parent, {
        _getLocalItemID: function(item) {
            var itemPublic = item.public;
            var isDone = itemPublic.isDone;
            var dateProp = isDone ? 'doneDate' : 'dueDate';
            var date = itemPublic[dateProp];
            var priority = itemPublic.priority;

            return [1-isDone, date, priority].join('');
        },
        getGroupTitle: function(item) {
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
        getGroupID: function(item) {
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
        },
        getSortedItems: function() {
            var groups = this.list.getGroups();
            var dates = {
                dueDate: groups.dueDate,
                doneDate: groups.doneDate.reverse()
            };
            var items = {};
            var date;
            var filteredItems;

            this.orderedItemIDs = null;
            this.orderedItemIDs = {};

            for (var complete = 0; complete <= 1; complete++) {
                var isDone = !!complete;
                var dateProp = isDone ? 'doneDate' : 'dueDate';
                var filterProps = {
                    isDone: isDone
                };

                items[isDone] = {};
                for (var n = 0, N = dates[dateProp].length; n < N; n++) {
                    date = dates[dateProp][n];
                    filterProps[dateProp] = date || '^$';
                    for (var p = 2; p >= 0; p--) {
                        filterProps.priority = p;

                        filteredItems = this.list.filter(filterProps);
                        if (filteredItems.length > 0) {
                            if (!items[isDone][date]) {
                                items[isDone][date] = [];
                            }

                            Array.prototype.push.apply(items[isDone][date], filteredItems);

                            for (var i = 0, I = filteredItems.length; i < I; i++) {
                                this.orderedItemIDs.push([parseInt(isDone), p, date].join(''));
                            }
                        }
                    }
                }

                filterProps = null;
            }

            return items;
        }
    });
});