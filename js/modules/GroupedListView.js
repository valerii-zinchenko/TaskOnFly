 'use strict';

define([
    './GroupedListView/View',
    './GroupedListView/Control'
],function (View, Control) {
    TaskManager.Modules.GroupedListView = new MVCModule({
        View: View,
        Control: Control,

        initialize: function() {
            this.control.$.on('newItem', this.view._insertItem.bind(this.view));
        }
    });

    return TaskManager.Modules.GroupedListView;
});