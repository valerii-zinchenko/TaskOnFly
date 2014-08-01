/**
 * Created by valera on 8/1/14.
 */

'use strict';

var TaskMe;
(function() {
    var ROOT_TASK_LIST = null,
        CURRENT_TASK_LIST = null;

    TaskMe = {
        setRootList: function(list) {
            ROOT_TASK_LIST = list;
        },
        getRootList: function() {
            return ROOT_TASK_LIST;
        },
        setCurrentList: function(list) {
            CURRENT_TASK_LIST = list;
        },
        getCurrentList: function() {
            return CURRENT_TASK_LIST;
        },
        changeView: function(page) {
            if (page[0] !== '#') {
                page = '#' + page;
            }
            window.location.hash = page;
        }
    };
})();