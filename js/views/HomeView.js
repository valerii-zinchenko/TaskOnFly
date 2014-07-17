define([
    'text!templates/home.html',
    'backbone'
], function(template) {
    var HomeView = Backbone.View.extend({
        el: '#home',
        template: _.template(template),
        initialize: function() {
            //todo: sync data from device
        },
        render: function() {
            this.$el.html(this.template())
        }
    });

    return HomeView;
});
