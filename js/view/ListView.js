/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/


'use strict';

define([
    'control/ListControl',
    'view/PopupDialog'
], function(Control) {
    var ListView = new Class({
        template: '<div class="task-list"></div>',
        simpleListTemplate:
'<table class="full"> \
    <thead>\
        <tr><th></th><th></th></tr> \
    </thead> \
    <tbody> \
    <% var displayedDate = ""; %> \
    <% _.each(public.items, function(item) { %> \
        <% var modelPublic = models[item].public; %> \
        <tr data-item-id="<%= modelPublic.id %>"> \
            <th> \
                <div class="list-item <%= modelPublic.type.toLowerCase() %> priority-<%= modelPublic.priority %> <% if (modelPublic.isDone) {%> done <% } %>"> \
                    <input id="<%= modelPublic.id %>" type="checkbox" <% if (modelPublic.isDone) { %> checked <% } %>> \
                    <label for="<%= modelPublic.id %>"><%= modelPublic.title %></label> \
                </div> \
            </th> \
            <td> \
                <div data-role="controlgroup" data-type="horizontal"> \
                    <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button> \
                </div> \
            </td> \
        </tr> \
    <% }) %> \
    </tbody> \
</table>',
        groupTemplate:
'<div id="<%= groupID %>"> \
    <div class="group-title ui-corner-all"><%= title %></div> \
    <table class="full task-list"> \
        <thead><tr><th></th><th></th></tr></thead> \
        <tbody>\
        <% _.each(items, function(item) { %>\
        <% var modelPublic = models[item].public; %>\
            <tr data-item-id="<%= modelPublic.id %>">\
                <th>\
                    <div class="list-item <%= modelPublic.type.toLowerCase() %> priority-<%= modelPublic.priority %> <% if (modelPublic.isDone) {%> done <% } %>">\
                        <input id="<%= modelPublic.id %>" type="checkbox" <% if (modelPublic.isDone) { %> checked <% } %>>\
                        <label for="<%= modelPublic.id %>"><%= modelPublic.title %></label>\
                    </div>\
                </th>\
                <td>\
                    <div data-role="controlgroup" data-type="horizontal">\
                        <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button>\
                    </div>\
                </td>\
            </tr>\
        <% }); %>\
        </tbody>\
    </table>\
</div>',

        $content: null,
        $currentList: null,

        initialize: function(holder, list) {
            this.$content = holder;

            this.control = new Control(list);
            this.control.$.on('newItem', this._insertItem.bind(this));

            TaskOnFly.$.on('showList', this.onShowList.bind(this));

            var that = this;
            $(window).on('orientationchange', function() {
                // Timeout is used here because at this moment there is no guaranties
                // that the new window dimensions are already applied.
                setTimeout(function(){
                    that._fixWidth();
                }, 300);
            });
        },
        render: function() {
            if (this.$currentList) {
                this.$currentList.remove();
            }

            this.$currentList = this._prepareListElement(this.control.getList());

            this.$content.append(this.$currentList);
            this.$content.trigger('create');

            this._postRender();
            return this;
        },
        _prepareListElement: function(list) {
            var $el = $(_.template(this.template, this));
            list.sort();

            if (this.control.useGroups) {
                var groups = list.getGroups();

                var firstGroupLevel = groups.sortingOrder['0'];
                for (var n = 0, N = firstGroupLevel.length; n < N; n++) {
                    var dates = groups.sortingOrder['1'][firstGroupLevel[n]];
                    for (var m = 0, M = dates.length; m < M; m++) {
                        var itemIDs = list._object2Array(groups[firstGroupLevel[n]][dates[m]], groups.sortingOrder['2']);
                        $el.append(_.template(this.groupTemplate, {
                            groupID: this.control.getGroupID(list, itemIDs[0]),
                            title: this.control.getGroupTitle(list, itemIDs[0]),
                            items: itemIDs,
                            models: list.models
                        }));
                    }
                }
            } else {
                $el.append(_.template(this.simpleListTemplate, list));
            }

            return $el;
        },
        _postRender: function() {
            this._attachEvents();
            this._fixWidth();
            this._disableListCheckbox();
        },

        selectList: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');
            TaskOnFly.changeView(['#path', this.control.getList().getLocation(), id, '/'].join(''));
        },
        selectParentList: function() {
            TaskOnFly.changeView('#path' + this.control.getList().getParentLocation());
        },
        onShowList: function(ev, list) {
            this._switchLists(list);
        },
        _switchLists: function(newList) {
            var $newList = this._prepareListElement(newList);
            var list = this.control.getList();

            if (newList.public.items.length > 0) {
                this.$content.append($newList);
                $newList.trigger('create');
            }

            if (list._parent && list._parent.public.id === newList.public.id) {
                //todo Position new list to the left side and move both lists from left to the right
            } else {
                //todo Position new list to the right side and move both lists from right to the left
            }

            this.$currentList.remove();
            this.$currentList = $newList;

            if (newList.public.items.length > 0) {
                this._postRender();
            }

            this.control.setList(newList);
        },
        _attachEvents: function() {
            this.$currentList.find('.list-item.task input').on('change', this._toggleTaskStatus.bind(this));
            this.$currentList.find('.list-item.list').on('vclick', this.selectList.bind(this));
            this.$currentList.find('.edit-btn').on('click', this._editItem.bind(this));
            this.$currentList.find('.delete-btn').on('click', this._removeItem.bind(this));
        },
        _toggleTaskStatus: function(ev) {
            ev.preventDefault();

            var $target = $(ev.target);
            var $el = $target.parents('tr');
            var id = $target.prop('id');
            var list = this.control.getList();
            var siblingID,
                $sibling;

            if (this.control.useGroups) {
                var oldGroupID = this.control.getGroupID(list, id);
            } else {
                var indexBefore = list.public.items.indexOf(id);
            }

            this.control._toggleTaskStatus(id);

            var indexAfter = list.public.items.indexOf(id);
            if (this.control.useGroups) {
                var newGroupID = this.control.getGroupID(list, id);
                if (newGroupID === oldGroupID) {
                    return;
                }
            } else {
                if (indexAfter === indexBefore) {
                    return;
                }
            }

            $el.detach();

            if (indexAfter+1 === list.public.items.length) {
                siblingID = list.public.items[indexAfter - 1];
            } else {
                siblingID = list.public.items[indexAfter + 1];
            }

            if (this.control.useGroups) {
                var $group = this.$currentList.find('#' + newGroupID);

                if ($group.length === 0) {
                    $group = $(_.template(this.groupTemplate, {
                        groupID: newGroupID,
                        title: this.control.getGroupTitle(list, id),
                        items: [],
                        models: list.models
                    }));
                    var siblingGroupID = this.control.getGroupID(list, siblingID);
                    var $siblingGroup = this.$currentList.find('#' + siblingGroupID);

                    if (indexAfter+1 === list.public.items.length) {
                        $group.insertAfter($siblingGroup);
                    } else {
                        $group.insertBefore($siblingGroup);
                    }

                    $group.find('tbody').append($el);
                } else {
                    $sibling = $group.find('tr[data-item-id=' + siblingID + ']');

                    // if siblingID is placed in other group, then simply append the element to the end of the group
                    if ($sibling[0]) {
                        if (indexAfter+1 === list.public.items.length) {
                            $el.insertAfter($sibling);
                        } else {
                            $el.insertBefore($sibling);
                        }
                    } else {
                        $group.find('tbody').append($el);
                    }
                }

                var $oldGroup = this.$currentList.find('#' + oldGroupID);
                if ($oldGroup.find('.list-item').length === 0) {
                    $oldGroup.remove();
                }

                this._fixWidth();
            } else {
                $sibling = this.$currentList.find('tr[data-item-id=' + siblingID + ']');

                if (indexAfter+1 === list.public.items.length) {
                    $el.insertAfter($sibling);
                } else {
                    $el.insertBefore($sibling);
                }
            }

            $el.find('.list-item').toggleClass('done');
        },
        _insertItem: function() {
            this.render();
        },
        _editItem: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');

            this.control._editItem(id);
        },
        _removeItem: function(ev) {
            ev.preventDefault();
            var $tr = $(ev.target).parents('tr'), id = $tr.data('item-id');

            if ($tr.find('.list').length > 0) {
                new TaskManager.PopupDialog({
                    messages: ['Are you sure you want to delete the list of tasks?', 'This action cannot be undone.'],
                    controls: [
                        {
                            title:    'Yes',
                            callback: this._continueRemoving.bind(this, $tr, id)
                        },
                        {
                            title: 'Cancel'
                        }
                    ]
                }).show();
            } else {
                this._continueRemoving($tr, id);
            }
        },
        _continueRemoving: function($el, id) {
            $el.remove();
            if (this.control.useGroups) {
                var groupID = this.control.getGroupID(this.control.getList(), id);
                var $group = this.$currentList.find('#' + groupID);
                if ($group.find('.list-item').length === 0) {
                    $group.remove();
                }
            }

            this.control._removeItem(id);
        },

        _fixWidth: function () {
            var $tables = this.$currentList.find('table');
            var th = $tables.find('th:first');
            var lists = $tables.find('.list-item label');

            $tables.removeClass('fixed');
            lists.removeClass('nowrap');

            th.css('width', th.width());

            $tables.addClass('fixed');
            lists.addClass('nowrap');
        },

        _disableListCheckbox: function () {
            this.$currentList.find('.list-item.list input').prop('disabled', true);
        }
    });

    TaskManager.ListView = ListView;
    return ListView;
});