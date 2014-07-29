'use strict';

define([
    'text!templates/home.html'
], function(template) {
    var HomeView = new Class({
        _isReady: false,

        page: 'home',
        $addTaskBtn: null,
        $addListBtn: null,

        render: function() {
            if (!this.$el || this.$el.length === 0) {
                this.$el = $('#' + this.page);
            }
            this.$el.html(_.template(template));
            this.$el.trigger('create');

            this._initControls();
            this.$el.find('#list li').off('vclick').on('vclick', this.viewItem);

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
            window.location.hash = '#add/task' + MAIN.CURRENT_LIST.public.path;
        },
        addList: function(ev) {
            ev.preventDefault();
            window.location.hash = '#add/list' + MAIN.CURRENT_LIST.public.path;
        },

        viewItem: function(ev) {
            ev.preventDefault();
            window.location.hash = '#view' + MAIN.CURRENT_LIST.public.path;
        }
    });

    return HomeView;
});
