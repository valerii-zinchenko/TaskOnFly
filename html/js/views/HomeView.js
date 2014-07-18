define([
    'text!templates/home.html',
    'mainLibs'
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

            }
        });

        instance.initialize();
        return instance;
    }

    return HomeView;
});
