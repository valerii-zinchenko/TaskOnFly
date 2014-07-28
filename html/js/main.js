/**
 * Created by valera on 7/23/14.
 */

'use strict';

this.MAIN = {};

define([
    'js/routers/MainRouter',
    'js/collections/TaskList'
], function(MainRouter, TaskList) {
    var rooter = new MainRouter();

    MAIN.TASK_LIST = new TaskList('');
    MAIN.CURRENT_LIST = MAIN.TASK_LIST;

    //todo: sync data from device

    if (location.hash === '') {
        location.hash = '#home';
    } else {
        rooter[location.hash.slice(1)]();
    }
});
