/**
 * Created by Valerii Zinchenko on 8/2/14.
 */

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


$ = function() {return $};
$.html = function(){};
$.find = $;
$.on = function(){};
$.trigger = function(){};

$.mobile = {
    changePage: function() {}
};
