/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

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
],function (Parent) {
    return new Class(Parent, {
        groupTemplate:
'<div id="<%= groupID %>">\
    <div class="group-title ui-corner-all"><%= title %></div>\
</div>',

        _prepareListElement: function(list) {
            var groupItemIDs = [[]];
            var $el = $(_.template(this.template, this));
            list.sort();

            var items = list.public.items;
            if (items.length == 0) {
                return $el;
            }

            var groupID;
            var nGroup = 0;
            var newGroupID = this.control.getGroupID(items[0]);
            for (var n = 0, N = items.length; n < N; n++) {
                groupID = this.control.getGroupID(items[n]);

                if (newGroupID != groupID) {
                    newGroupID = groupID;
                    groupItemIDs.push([]);
                    nGroup++;
                }

                groupItemIDs[nGroup].push(items[n]);
            }

            var id, $group;
            for (n = 0, N = groupItemIDs.length; n < N; n++) {
                id = groupItemIDs[n][0];

                $group = $(_.template(this.groupTemplate, {
                    groupID: this.control.getGroupID(id),
                    title: this.control.getGroupTitle(id)
                }));

                $group.append(_.template(this.listTemplate, {
                    items: groupItemIDs[n],
                    models: list.models
                }));

                $el.append($group);
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

            $el.find('.list-item').toggleClass('done');

            var oldGroupID = this.control.getGroupID(id);

            this.control._toggleTaskStatus(id);

            var indexAfter = list.public.items.indexOf(id);
            var newGroupID = this.control.getGroupID(id);
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
                    title: this.control.getGroupTitle(id)
                }));
                $group.append(_.template(this.listTemplate, {
                    items: [],
                    models: list.models
                }));

                if (siblingID) {
                    var siblingGroupID = this.control.getGroupID(siblingID);
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
        },
        _continueRemoving: function($el, id) {
            $el.remove();

            var groupID = this.control.getGroupID(id);
            var $group = this.$currentList.find('#' + groupID);
            if ($group.find('.list-item').length === 0) {
                $group.remove();
            }

            this.control._removeItem(id);
        }
    });
});
