/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

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

suite('ListViewGroupedByDate.Control', function() {
    var Module, TaskListModule;
    setup(function(done) {
        requirejs(['modules/ListViewGroupedByDate/Control'], function(Control) {
            Module = Control;
            TaskListModule = TaskManager.TaskList;
            done();
        })
    });
    teardown(function() {
        window.localStorage.storage = {};
    });

    suite('initialize()', function() {
        test('correct input argument', function() {
            assert.doesNotThrow(function() {
                new Module(new TaskListModule('root'));
            });
        });
    });

    suite('Test methods', function() {
        var module;

        setup(function() {
            module = new Module();
        });
        teardown(function() {
            window.localStorage.storage = {};
        });

        suite('getGroupTitle()', function() {
            test('isDone: true; doneDate: undefined', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: true
                            }
                        }
                    }
                };
                var title;

                assert.doesNotThrow(function() {
                    title = module.getGroupTitle(id);
                });

                assert.equal(title, 'done ', 'Incorrect group title was generated');
            });
            test('isDone: true; doneDate: 2014.11.11', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: true,
                                doneDate: '2014.11.11'
                            }
                        }
                    }
                };
                var title;

                assert.doesNotThrow(function() {
                    title = module.getGroupTitle(id);
                });

                assert.equal(title, 'done at 2014.11.11', 'Incorrect group title was generated');
            });
            test('isDone: false; dueDate: undefined', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: false
                            }
                        }
                    }
                };
                var title;

                assert.doesNotThrow(function() {
                    title = module.getGroupTitle(id);
                });

                assert.equal(title, 'to do', 'Incorrect group title was generated');
            });
            test('isDone: false; dueDate: 2014.11.12', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: false,
                                dueDate: '2014.11.12'
                            }
                        }
                    }
                };
                var title;

                assert.doesNotThrow(function() {
                    title = module.getGroupTitle(id);
                });

                assert.equal(title, 'till 2014.11.12', 'Incorrect group title was generated');
            });
        });

        suite('getGroupID()', function() {
            test('isDone: true; doneDate: undefined', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: true
                            }
                        }
                    }
                };
                var groupID;

                assert.doesNotThrow(function() {
                    groupID = module.getGroupID(id);
                });

                assert.equal(groupID, 'true', 'Incorrect group title was generated');
            });
            test('isDone: true; doneDate: 2014.11.11', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: true,
                                doneDate: '2014.11.11'
                            }
                        }
                    }
                };
                var groupID;

                assert.doesNotThrow(function() {
                    groupID = module.getGroupID(id);
                });

                assert.equal(groupID, 'true2014.11.11', 'Incorrect group title was generated');
            });
            test('isDone: false; dueDate: undefined', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: false
                            }
                        }
                    }
                };
                var groupID;

                assert.doesNotThrow(function() {
                    groupID = module.getGroupID(id);
                });

                assert.equal(groupID, 'false', 'Incorrect group title was generated');
            });
            test('isDone: false; dueDate: 2014.11.12', function() {
                var id = 'taskid';
                module.list = {
                    models: {
                        taskid: {
                            'public': {
                                isDone: false,
                                dueDate: '2014.11.12'
                            }
                        }
                    }
                };
                var groupID;

                assert.doesNotThrow(function() {
                    groupID = module.getGroupID(id);
                });

                assert.equal(groupID, 'false2014.11.12', 'Incorrect group title was generated');
            });
        });
    });
});
