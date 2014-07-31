'use strict';

define([
    'text!templates/home.html',
    'text!templates/list.html'
], function(template, templateList) {
    var HomeView = new SingletonClass({
        _isReady: false,

        page: 'home',
        $addTaskBtn: null,
        $addListBtn: null,

        render: function() {
            if (!this.$el || this.$el.length === 0) {
                this.$el = $('#' + this.page);
                this.$el.html(_.template(template));
            }

            this._init();
            if (MAIN.CURRENT_LIST.length > 0) {
                this.$content.find('#list').remove();
                this.$content.append(_.template(templateList, MAIN.CURRENT_LIST));
            }

            this.$el.trigger('create');

            if (MAIN.CURRENT_LIST.length > 0) {
                this._attachListEvents();
            }
            return this;
        },
        _init: function() {
            if (this._isReady) {
                return;
            }
            this._isReady = true;

            this.$content = this.$el.find('#content');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');

            this.$addTaskBtn.on('click', this.addTask);
            this.$addListBtn.on('click', this.addList);
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));
        },
        _attachListEvents: function() {
            //todo Reattach this event to the edit button
//            this.$content.find('#list div.task').off('click').on('click', this.editItem);
            this.$content.find('#list div.list').off('click').on('click', this.selectList.bind(this));
        },

        addTask: function(ev) {
            ev.preventDefault();
            utils.changeView('add/task');
        },
        addList: function(ev) {
            ev.preventDefault();
            utils.changeView('add/list');
        },
        editItem: function(ev) {
            ev.preventDefault();
            var $target = $(ev.target),
                $el = $target,
                name;

            if (!$el.data('name')) {
                $el = $target.parents('div.task');
                if (!$el.data('name')) {
                    $el = $target.parents('div.list');
                }
            }

            name = $el.data('name');
            utils.changeView('edit/' + name);
        },
        selectList: function(ev) {
            ev.preventDefault();
            var $el = $(ev.target),
                name;

            if (!$el.data('name')) {
                $el = $el.parents('div.list');
            }

            name = $el.data('name');
            MAIN.CURRENT_LIST.selectList(name);

            var $prevList = this.$content.find('#list'),
                $list = $(_.template(templateList, MAIN.CURRENT_LIST));

            if (MAIN.CURRENT_LIST.length > 0) {
                this.$content.append($list);
                $list.controlgroup();
            }

            //todo animate the list changing

            $prevList.remove();

            if (MAIN.CURRENT_LIST.length > 0) {
                this._attachListEvents()
            }
        },
        selectPreviousList: function(ev) {
            ev.preventDefault();
            MAIN.CURRENT_LIST.selectParentList();

            var $prevList = this.$content.find('#list'),
                $list = $(_.template(templateList, MAIN.CURRENT_LIST));

            if (MAIN.CURRENT_LIST.length > 0) {
                this.$content.append($list);
                $list.controlgroup();
            }

            //todo animate the list changing

            $prevList.remove();

            if (MAIN.CURRENT_LIST.length > 0) {
                this._attachListEvents()
            }
        }
    });

    return HomeView;
});
