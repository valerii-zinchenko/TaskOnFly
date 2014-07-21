define([
    'text!templates/home.html'
], function(template) {
    var HomeView;

    (function() {
        var instance;

        HomeView = function() {
            if (instance) {
                return instance;
            }

            _.extend(this, {
                initialize: function() {
                    //todo: sync data from device
                },
                render: function() {
                    if (!this.$el || this.$el.length === 0) {
                        this.$el = $('#home');
                    }
                    this.$el.html(_.template(template));
                    this.$el.trigger('create');

                    return this;
                },
                addTask: function() {
                    location.hash = 'task';
                }
            });

            this.initialize();
            instance = this;
            return this;
        };
    })();

    return HomeView;
});
