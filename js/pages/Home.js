/**
 * Created by valera on 29/10/14.
 */
define([
    './Home/View',
    './Home/Control'
], function (View, Control) {
    TaskManager.Pages.Home = new MVCModule({
        View: View,
        Control: Control
    });

    return TaskManager.Pages.Home;
});