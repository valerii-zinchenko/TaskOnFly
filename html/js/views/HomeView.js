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
                $addTaskBtn: null,
                $addListBtn: null,
                isReady: false,

                initialize: function() {
                    //todo: sync data from device
                },
                render: function() {
                    if (!this.$el || this.$el.length === 0) {
                        this.$el = $('#home');
                    }
                    this.$el.html(_.template(template));
                    this.$el.trigger('create');

                    this._initControls();

                    return this;
                },
                _initControls: function() {
                    if (this.isReady) {
                        return;
                    }

                    this.isReady = true;
                    this.$addTaskBtn = this.$el.find('#addTask');
                    this.$addListBtn = this.$el.find('#addList');

                    this.$addTaskBtn.on('click', this.addTask);
                    this.$addListBtn.on('click', this.addList);
                },

                addTask: function(ev) {
                    MAIN.TASK_LIST.createTask();
                },
                addList: function(ev) {
                    MAIN.TASK_LIST.createSubList();
                }
            });

            this.initialize();

            instance = this;
            return this;
        };
    })();

    return HomeView;
});
