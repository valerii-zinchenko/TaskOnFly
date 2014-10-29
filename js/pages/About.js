/**
 * Created by valera on 29/10/14.
 */
define([
    'pages/View'
], function (View) {
    TaskManager.Pages.About = new MVCModule({
        View: View
    });

    return TaskManager.Pages.About;
});