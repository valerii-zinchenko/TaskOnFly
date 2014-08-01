/**
 * Created by valera on 7/21/14.
 */

'use strict';

var SingletonClass = new AClass(function() {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        utils.deepExtend(this, this.constructor.prototype._defaults);

        if (this.constructor.parent && this.constructor.parent.hasOwnProperty('initialize')) {
            this.constructor.parent.initialize.apply(this, arguments);
        }
        if (this.constructor.prototype.hasOwnProperty('initialize')) {
            this.constructor.prototype.initialize.apply(this, arguments);
        }

        return this.constructor.instance;
    });

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SingletonClass;
}