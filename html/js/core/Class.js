/**
 * Created by valera on 7/25/14.
 */

'use strict';

var Class = new AClass(function() {
    utils.deepExtend(this, this.constructor.prototype._defaults);

    if (this.constructor.parent && this.constructor.parent.hasOwnProperty('initialize')) {
        this.constructor.parent.initialize.apply(this, arguments);
    }
    if (this.constructor.prototype.hasOwnProperty('initialize')) {
        this.constructor.prototype.initialize.apply(this, arguments);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Class;
}

/*
new Class({
    private: {

    },
    protected: {

    },
    public: {

    }
});
*/

