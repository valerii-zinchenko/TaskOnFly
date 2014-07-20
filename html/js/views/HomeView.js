define([
    'text!templates/home.html'
], function(template) {
    function HomeView() {
        var instance;

        HomeView = function HomeView() {
            return instance;
        };
        HomeView.prototype = this;

        instance = new HomeView();
        _.extend(instance, {
            constructor: HomeView,
            initialize: function() {
                //todo: sync data from device
                this.render();
            },
            render: function() {
                this.$el = $('#home');
                this.$el.html(_.template(template));
                this.$el.trigger('create');
                return this;
            },
            addTask: function() {
                location.hash = 'task';
            }
        });

        instance.initialize();
        return instance;
    }

    return HomeView;
});
