/**
 * Created by valera on 7/21/14.
 */

'use strict'

function SingletonClass(Parent, props) {
    var instance = null,
        initialize = null;

    if (typeof Parent !== 'function') {
        props = Parent;
        Parent = Object;
    }

    if (!props) {
        props = {};
    }
    if (props.initialize) {
        initialize = props.initialize;
    }

    props.initialize = function() {
        if (instance) {
            return instance;
        }
        instance = this;

        if (initialize) {
            initialize.apply(this, arguments);
        }

        return instance;
    };

    return new Class(Parent, props);
}

if (exports) {
    exports.SingletonClass = SingletonClass;
}