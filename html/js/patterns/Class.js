/**
 * Created by valera on 7/25/14.
 */

'use strict';

function Class(Parent, props) {
    var Child, F, i;

    Child = function() {
        if (Child.parent && Child.parent.hasOwnProperty('initialize')) {
            Child.parent.initialize.apply(this, arguments);
        }
        if (Child.prototype.hasOwnProperty('initialize')) {
            Child.prototype.initialize.apply(this, arguments);
        }
    };

    if (typeof Parent !== 'function') {
        props = Parent;
        Parent = Object;
    }
    if (props && typeof props !== 'object') {
        throw new Error('Incorrect input arguments. It should be: new Class([[Function], Object])');
    }

    F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.parent = Parent.prototype;
    Child.prototype.constructor = Child;

    for (i in props) {
        if (props.hasOwnProperty(i)) {
            Child.prototype[i] = props[i];
        }
    }

    return Child;
}

if (exports) {
    exports.Class = Class;
}