/**
 * Created by valera on 7/17/14.
 */
define([
    'collection/Tasks',
    'models/GroupTask'
],function (Tasks, GroupTask) {
    var GroupsOfTasks = Tasks.extend({
        model: GroupTask
    });

    return GroupsOfTasks;
});