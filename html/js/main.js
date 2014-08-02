/**
 * Created by Valerii Zinchenko on 7/23/14.
 */

'use strict';

define([
    'js/routers/MainRouter',
    'js/collections/TaskList'
], function(MainRouter, TaskList) {
    return function() {
        TaskMe.setRootList(new TaskList('root'));
        TaskMe.setCurrentList(TaskMe.getRootList());

        var rooter = new MainRouter();

        //todo: sync data from device

        rooter.home();
    }
});
