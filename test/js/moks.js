/**
 * Created by Valerii Zinchenko on 8/2/14.
 */

window = {
    storage: {},
    localStorage: {
        setItem: function(key, value) {
            window.storage.key = value;
        },
        getItem: function(key) {
            return window.storage[key];
        }
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
