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


'use strict';

suite('Test APanel.View', function() {
    var Module;
    setup(function(done) {
        requirejs(['modules/APanel/View'], function(View) {
            Module = View;

            done();
        });
    });

    test('Not singleton?', function() {
        assert.notEqual(new Module(), new Module());
    });

    suite('initialize()', function() {
        var module;
        test('without arguments', function() {
            assert.doesNotThrow(function() {
                module = new Module();
            });

            assert.isNull(module._$holder, '_$holder should not be changed');
            assert.equal(module.panelID, '', 'panelID should not be changed');
            assert.equal(module.items.length, 0, 'items should not be changed');
        });
        test('input arguments validation', function() {
            assert.throw(function () {
                new Module(':)');
            }, Error, 'Incorrect type of the input argument');
        });

        test('with proper arguments', function() {
            var input = {
                page: {},
                id: 'id',
                items: [
                    {
                        title: 'title1',
                        link: 'link1'
                    },
                    {
                        title: 'title2',
                        link: 'link2'
                    }
                ]
            };
            assert.doesNotThrow(function() {
                module = new Module(input);
            });

            assert.equal(module._$holder, input.page, '_$holder has different reference');
            assert.equal(module.panelID, input.id, 'panelID is different');

            assert.equal(module.items.length, input.items.length, 'Not all items were set to the panel');
            assert.equal(module.items[0], input.items[0], 'First item does not correspond to the first requested item');
            assert.equal(module.items[1], input.items[1], 'Second item does not correspond to the second requested item');
        });
    });

    suite('Test object methods', function() {
        var module;
        setup(function() {
            module = new Module();
        });

        test('setPanelPage()', function() {
            assert.throw(function() {
                new Module({
                    page: ':)'
                });
            }, Error, 'Incorrect type of the "page" property');

            var page = {};
            assert.doesNotThrow(function() {
                module.setPanelPage(page);
            });
            assert.equal(module._$holder, page, 'Incorrect reference to the page where the panel will be connected');
        });

        test('setPanelID()', function() {
            assert.throw(function() {
                new Module({
                    id: {}
                });
            }, Error, 'Incorrect type of the "id" property');

            assert.throw(function() {
                new Module({
                    id: ''
                });
            }, Error, 'Incorrect "id" value');

            var id = 'id';
            assert.doesNotThrow(function() {
                new Module({
                    id: id
                });
            });
            assert.equal(module.panelID, id, 'Incorrect panelID was set');
        });

        test('setPanelItems()', function() {
            assert.throw(function() {
                new Module({
                    items: {}
                });
            }, Error, 'Incorrect type of the "items" property');
            assert.throw(function() {
                new Module({
                    items: [
                        ':)'
                    ]
                });
            }, Error, 'Incorrect type of the content in "items" property');
            assert.throw(function() {
                new Module({
                    items: [
                        {}
                    ]
                });
            }, Error, 'Incorrect object content in "items" array');
            assert.throw(function() {
                new Module({
                    items: [
                        {link:':)'}
                    ]
                });
            }, Error, '"title" property is missed in object content in "items" array');
            assert.throw(function() {
                new Module({
                    items: [
                        {title:':)'}
                    ]
                });
            }, Error, '"link" property is missed in object content in "items" array');
            assert.throw(function() {
                new Module({
                    items: [
                        {
                            title:':)',
                            link: ''
                        }
                    ]
                });
            }, Error, '"link" property should not be empty in object content in "items" array');
            assert.throw(function() {
                new Module({
                    items: [
                        {
                            title:'',
                            link: ':)'
                        }
                    ]
                });
            }, Error, '"title" property should not be empty in object content in "items" array');
            assert.throw(function() {
                new Module({
                    items: [
                        {
                            title: {},
                            link: ':)'
                        }
                    ]
                });
            }, Error, 'Incorrect type of "title" property in object content in "items" array');
            assert.throw(function() {
                new Module({
                    items: [
                        {
                            title: ':)',
                            link: {}
                        }
                    ]
                });
            }, Error, 'Incorrect type of "link" property in object content in "items" array');
        });

        test('close()', function() {
            assert.doesNotThrow(function() {
                module.close();
            });
        });

        suite('render()', function() {
            test('no items', function() {
                sinon.spy(module, '_attachEvents');

                assert.doesNotThrow(function() {
                    module.render();
                });

                assert.equal(module._attachEvents.callCount, 0, 'Panel should no be rendered if no items are supplied');

                module._attachEvents.restore()
            });

            test('no _$holder', function() {
                module.setPanelItems([
                    {
                        title: ':)',
                        link: ':D'
                    }
                ]);

                assert.throw(function() {
                    module.render();
                }, Error, 'Page element is not defined for panel');
            });

            test('no panelID', function() {
                module.setPanelItems([
                    {
                        title: ':)',
                        link: ':D'
                    }
                ]);
                module.setPanelPage({});

                assert.throw(function() {
                    module.render();
                }, Error, 'Panel ID is not defined');
            });

            test('render panel', function() {
                sinon.spy(module, '_attachEvents');

                module.setPanelItems([
                    {
                        title: ':)',
                        link: ':D'
                    }
                ]);
                module.setPanelPage($);
                module.setPanelID('id');

                assert.doesNotThrow(function() {
                    module.render();
                });
                assert.doesNotThrow(function() {
                    module.render();
                });

                assert.equal(module._attachEvents.callCount, 1, '_attachEvents() should be called once to attach event handlers to the view');

                module._attachEvents.restore();
            });
        });
    });
});