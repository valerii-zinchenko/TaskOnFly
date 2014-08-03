/**
 * Created by Valerii Zinchenko on 7/23/14.
 */

'use strict';

define([
    'js/routers/MainRouter',
    'js/collections/TaskList'
], function(MainRouter, TaskList) {
    function sync(listRef) {
        listRef.public.items.forEach(function(itemID) {
            var itemData = TaskMe.loadItem(itemID),
                item = listRef['add' + itemData.type](itemData);

            if (itemData.type === 'List') {
                sync(item);
            }
        });

    }
    return function() {
        var rooter = new MainRouter(),
            store = TaskMe.loadAllItems(),
            rootList = new TaskList('root');

        if (store && store.root) {
            rootList.saveData(store.root);
            sync(rootList);
        }

        TaskMe.setRootList(rootList);
        TaskMe.getRootList().saveData();
        TaskMe.setCurrentList(TaskMe.getRootList());

        //todo: sync data from device

        rooter.home();
    }
});
