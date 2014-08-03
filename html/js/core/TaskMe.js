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

            if (!item.public || typeof item.public !== 'object') {
                throw new Error('Item object does not contain public object');
            }
            if (!item.public.id) {
                throw new Error('Item id is not defined');
            }

            var id = item.public.id,
                items = loadLocal('items') || [];

            if (items.indexOf(id) === -1) {
                items.push(id);
            } else {
                console.log('update ' + id);
            }

            saveLocal('items', items);
            saveLocal(id, item.public);
        },
        loadItem: function(id) {
            if (!id) {
                throw new Error('Item id is not defined');
            }
            return loadLocal(id);
        },
        removeItem: function(item) {
            if (!item) {
                return;
            }

            var id = item.public.id,
                items = loadLocal('items'),
                index = items.indexOf(id);

            if (index > -1) {
                items.splice(index,1);
            }

            saveLocal('items', items);
            removeLocal(id);
        },
        loadAllItems: function() {
            var itemList = loadLocal('items'),
                items = {};

            if (!itemList) {
                return null;
            }

            itemList.forEach(function(id) {
                items[id] = loadLocal(id)
            });

            return items;
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskMe;
}