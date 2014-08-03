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

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(template));
            this.$content = this.$el.find('#content');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');

            this.$addTaskBtn.on('click', this.addTask);
            this.$addListBtn.on('click', this.addList);
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));
        },
        render: function() {
            var list = TaskMe.getCurrentList();

            if (list.length > 0) {
                this.$content.find('.list').remove();
                this.$content.append(_.template(templateList, list));
            }

            this.$el.trigger('create');

            if (list.length > 0) {
                this._attachListEvents();
            }
            return this;
        },
        _attachListEvents: function() {
            this.$content.find('.list td .edit-btn').off('click').on('click', this.editItem);
            this.$content.find('.list td .delete-btn').off('click').on('click', this.removeItem);
            this.$content.find('.list div.list').off('click').on('click', this.selectList.bind(this));
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
            var id = $(ev.target).parents('tr').data('item-id');

            TaskMe.changeView('edit/' + id);
        },
        removeItem: function(ev) {
            ev.preventDefault();
            var $tr = $(ev.target).parents('tr'),
                id = $tr.data('item-id');

            TaskMe.getCurrentList().removeItem(id);
            $tr.remove();
        },
        selectList: function(ev) {
            ev.preventDefault();
            var list = TaskMe.getCurrentList(),
                id = $(ev.target).parents('tr').data('item-id');

            list.selectList(id);

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
