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

TaskManager = {
    version: '1.0.0',
    Pages: {},
    Modules: {}
};

window = {
    localStorage: {
        storage: {},

        setItem: function(key, value) {
            window.localStorage.storage[key] = value;
        },
        getItem: function(key) {
            return window.localStorage.storage[key];
        },
        removeItem: function(key) {
            delete window.localStorage.storage[key];
        },
        clear: function() {
            delete window.localStorage.storage;
            window.localStorage.storage = {};
        }
    },
    location: {
        hash: ''
    }
};

ev = {
    preventDefault: function(){}
};

$ = function() {return $};
$.html = function(){};
$.find = $;
$.remove = function() {};
$.on = function(){};
$.trigger = function(){};
$.empty = function(){};
$.append = function(){};
$.css = function(){};
$.outerWidth = function(){};
$.parents = function(){return $};
$.val = function(){};
$.width = function(){};
$.addClass = function(){};
$.removeClass = function(){};
$.toggleClass = function(){return $};
$.prop = function(){return $};
$.checkboxradio = function(){return $};
$.panel = function(){return $};
$.popup = function(){return $};

$.mobile = {
    changePage: function() {},
    pageContainer: {
        pagecontainer: function(){}
    }
};

document = {body: {}};
