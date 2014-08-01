/**
 * Created by valera on 7/23/14.
 */

'use strict';

define([
    'js/routers/MainRouter',
    'js/collections/TaskList'
], function(MainRouter, TaskList) {
    TaskMe.setRootList(new TaskList(''));
    TaskMe.setCurrentList(TaskMe.getRootList());

    var rooter = new MainRouter();

    //todo: sync data from device

    rooter.home();
});
