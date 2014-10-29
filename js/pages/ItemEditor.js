/**
 * Created by valera on 29/10/14.
 */
define([
    'pages/ItemEditor/View',
    'pages/ItemEditor/Control'
], function (View, Control) {
    TaskManager.Pages.ItemEditor = new MVCModule({
        View: View,
        Control: Control
    });

    return TaskManager.Pages.ItemEditor;
});