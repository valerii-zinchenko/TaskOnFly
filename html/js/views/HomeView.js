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
            var list = TaskMe.getCurrentList();

            if (!this.$el || this.$el.length === 0) {
                this.$el = $('#' + this.page);
                this.$el.html(_.template(template));
            }

            this._init();
            if (list.length > 0) {
                this.$content.find('#list').remove();
                this.$content.append(_.template(templateList, list));
            }

            this.$el.trigger('create');

            if (list.length > 0) {
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
            TaskMe.changeView('add/task');
        },
        addList: function(ev) {
            ev.preventDefault();
            TaskMe.changeView('add/list');
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
            TaskMe.changeView('edit/' + name);
        },
        selectList: function(ev) {
            ev.preventDefault();
            var list = TaskMe.getCurrentList(),
                $el = $(ev.target),
                name;

            if (!$el.data('name')) {
                $el = $el.parents('div.list');
            }

            name = $el.data('name');
            list.selectList(name);

            var $prevList = this.$content.find('#list'),
                $list = $(_.template(templateList, list));

            if (list.length > 0) {
                this.$content.append($list);
                $list.controlgroup();
            }

            //todo animate the list changing

            $prevList.remove();

            if (list.length > 0) {
                this._attachListEvents()
            }
        },
        selectPreviousList: function(ev) {
            ev.preventDefault();
            var list = TaskMe.getCurrentList();
            list.selectParentList();

            var $prevList = this.$content.find('#list'),
                $list = $(_.template(templateList, list));

            if (list.length > 0) {
                this.$content.append($list);
                $list.controlgroup();
            }

            //todo animate the list changing

            $prevList.remove();

            if (list.length > 0) {
                this._attachListEvents()
            }
        }
    });

    return HomeView;
});
