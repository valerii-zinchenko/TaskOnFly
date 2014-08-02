/**
 * Created by Valerii Zinchenko on 8/1/14.
 */

'use strict';

var TaskMe;
(function() {
    function saveLocal(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    function loadLocal(key) {
        var value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    function removeLocal(key) {
        window.localStorage.removeItem(key);
    }

    function checkItemType(type) {
        switch (type) {
            case 'task':
            case 'list':
                break;
            default :
                throw new Error('Unknown item type');
        }
    }

    TaskMe = {
        ROOT_TASK_LIST: null,
        CURRENT_TASK_LIST: null,
        setRootList: function(list) {
            if (!list) {
                throw new Error('Invalid list');
            }
            TaskMe.ROOT_TASK_LIST = list;
        },
        getRootList: function() {
            return TaskMe.ROOT_TASK_LIST;
        },
        setCurrentList: function(list) {
            if (!list) {
                throw new Error('Invalid list');
            }
            TaskMe.CURRENT_TASK_LIST = list;
        },
        getCurrentList: function() {
            return TaskMe.CURRENT_TASK_LIST;
        },
        changeView: function(page) {
            if (page[0] !== '#') {
                page = '#' + page;
            }
            window.location.hash = page;
        },
        saveItem: function(item) {
            if (!item) {
                throw new Error('item is not defined');
            }

            checkItemType(item._type);

            if (!item.public || typeof item.public !== 'object') {
                throw new Error('Item object does not contain public object');
            }
            if (!item.public.id) {
                throw new Error('Item id is not defined');
            }

            var key = [item._type, item.public.id].join('-'),
                items = loadLocal(item._type + 's') || [];

            items.push(item.public.id);
            saveLocal(item._type+'s', items);
            saveLocal(key, item.public);
        },
        loadItem: function(type, id) {
            checkItemType(type);
            if (!id) {
                throw new Error('Item id is not defined');
            }

            var key = [type, id].join('-');
            return loadLocal(key);
        },
        removeItem: function(item) {
            if (!item) {
                return;
            }

            var key = [item._type, item.public.id].join('-'),
                items = loadLocal(item._type + 's'),
                index = items.indexOf(item.public.id);

            if (index > -1) {
                items.splice(index,1);
            }

            saveLocal(item._type + 's', items);
            removeLocal(key);
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskMe;
}