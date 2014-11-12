/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/

suite('Test main file', function() {
    var Module;
    setup(function(done) {
        requirejs(['main'], function(Task) {
            Module = Task;
            done();
        })
    });
    teardown(function() {
        window.localStorage.storage = {};
        Object.keys(requirejs.s.contexts._.defined).forEach(function(module) {
            requirejs.undef(module);
        });
    });

    test('Application start', function() {
        assert.doesNotThrow(function() {
            Module();
        });
    });

    test('Application start with stored root/task', function() {
        window.localStorage.storage = {
            root: JSON.stringify({
                isDone: false,
                items: ['0'],
                type: 'List',
                parentID: 'root'
            }),
            '0': JSON.stringify({
                id: '0',
                title: 'title',
                isDone: false,
                type: 'Task',
                parentID: 'root'
            })
        };

        assert.doesNotThrow(function() {
            Module();
        });

        assert.equal(TaskOnFly.getRootList().public.items.length, 1);
    });

    test('Application start with stored root/list/task', function() {
        window.localStorage.storage = {
            root: JSON.stringify({
                isDone: false,
                items: ['0'],
                type: 'List',
                parentID: 'root'
            }),
            '0': JSON.stringify({
                id: '0',
                title: 'list title',
                isDone: false,
                items: ['1'],
                type: 'List',
                parentID: 'root'
            }),
            '1': JSON.stringify({
                id: '1',
                title: 'title',
                isDone: false,
                type: 'Task',
                parentID: '0'
            })
        };

        assert.doesNotThrow(function() {
            Module();
        });

        assert.equal(TaskOnFly.getRootList().public.items.length, 1);
        assert.equal(TaskOnFly.getRootList().models['0'].public.items.length, 1);
    })
});