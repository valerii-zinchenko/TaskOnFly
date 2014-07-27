'use strict';

define([
    'text!templates/home.html'
], function(template) {
    var HomeView = new Class({
        $addTaskBtn: null,
        $addListBtn: null,
        _isReady: false,

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
            if (this._isReady) {
                return;
            }

            this._isReady = true;
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');

            this.$addTaskBtn.on('click', this.addTask);
            this.$addListBtn.on('click', this.addList);
        },

        addTask: function(ev) {
            ev.preventDefault();
            window.location.hash = '#task/new/L0';
        },
        addList: function(ev) {
            ev.preventDefault();
            window.location.hash = '#list/new/L0';
        }
    });

    return HomeView;
});
