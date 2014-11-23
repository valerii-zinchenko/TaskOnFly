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
    '../ListView/View'
], function (Parent) {
    return new Class(Parent, {
        groupTemplate:
'<div id="<%= groupID %>">\
    <div class="group-title ui-corner-all"><%= title %></div>\
</div>',

        _prepareListElement: function(list) {
            var $el = $(_.template(this.template, this));

            var items = this.control.getSortedItems();
            for (var n = 0; n <=1 ; n++) {
                for (var date in items[!!n]) {
                    var firstItem = items[!!n][date][0];

                    var $group = $(_.template(this.groupTemplate, {
                        groupID: this.control.getGroupID(firstItem),
                        title: this.control.getGroupTitle(firstItem)
                    }));
                    $group.append(_.template(this.simpleListTemplate, {
                        items: items[!!n][date],
                        models: list.models
                    }));
                    $group.find('table').addClass('task-list');

                    $el.append($group);
                }
            }

            return $el;
        },
        _toggleTaskStatus: function(ev) {
            ev.preventDefault();

            var $target = $(ev.target);
            var $el = $target.parents('tr');
            var id = $target.prop('id');
            var list = this.control.getList();
            var siblingID,
                $sibling;

            var oldGroupID = this.control.getGroupID(list, id);

            this.control._toggleTaskStatus(id);

            var indexAfter = list.public.items.indexOf(id);
            var newGroupID = this.control.getGroupID(list, id);
            if (newGroupID === oldGroupID) {
                return;
            }

            $el.detach();

            if (indexAfter+1 === list.public.items.length) {
                siblingID = list.public.items[indexAfter - 1];
            } else {
                siblingID = list.public.items[indexAfter + 1];
            }

            var $group = this.$currentList.find('#' + newGroupID);

            if ($group.length === 0) {
                $group = $(_.template(this.groupTemplate, {
                    groupID: newGroupID,
                    title: this.control.getGroupTitle(list, id),
                    items: [],
                    models: list.models
                }));

                if (siblingID) {
                    var siblingGroupID = this.control.getGroupID(list, siblingID);
                    var $siblingGroup = this.$currentList.find('#' + siblingGroupID);

                    if (indexAfter+1 === list.public.items.length) {
                        $group.insertAfter($siblingGroup);
                    } else {
                        $group.insertBefore($siblingGroup);
                    }
                } else {
                    this.$currentList.append($group);
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

            $el.find('.list-item').toggleClass('done');
        },
        _continueRemoving: function($el, id) {
            $el.remove();
            var groupID = this.control.getGroupID(this.control.getList(), id);
            var $group = this.$currentList.find('#' + groupID);
            if ($group.find('.list-item').length === 0) {
                $group.remove();
            }

            this.control._removeItem(id);
        }
    });
});