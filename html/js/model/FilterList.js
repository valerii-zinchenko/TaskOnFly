/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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

define([
    'model/AProcessor'
] , function(AProcessor) {
    return new Class(AProcessor, {
        _rules: null,
        _NRules: 0,

        initialize: function(list, rules) {
            if (!rules) {
                return;
            }

            this.setRules(rules);
        },
        setRules: function(rules) {
            this._NRules = 0;
            this._rules = rules;

            for (var key in this._rules) {
                if (this._rules.hasOwnProperty(key)) {
                    this._NRules++;
                }
            }
        },

        _processor: function() {
            return _.filter(this._list.models, function(item) {
                var match = 0;
                for (var rule in this._rules) {
                    if (this._rules.hasOwnProperty(rule) && new RegExp(this._rules[rule], 'gi').test(item.public[rule])) {
                        match++;
                    }
                }

                return match === this._NRules;
            });
        }
    });
});