/**
 * Created by Valerii Zinchenko on 7/29/14.
 */

var utils = {
    deepCopy: function(target, source) {
        var key,
            value;

        for (key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }

            value = source[key];
            switch (Object.prototype.toString.call(value)) {
                case '[object Object]':
                    if (!target[key]) {
                        target[key] = {};
                    }
                    utils.deepCopy(target[key], value);
                    break;
                default :
                    target[key] = value
            }
        }

        return target;
    },
    deepExtend: function(target, source) {
        var key,
            value;

        for (key in source) {
            value = source[key];
            if (target.hasOwnProperty(key)) {
                if (typeof target[key] === 'object') {
                    utils.deepExtend(target[key], value);
                }
                continue;
            }

            switch (Object.prototype.toString.call(value)) {
                case '[object Object]':
                    if (!target[key]) {
                        target[key] = {};
                    }
                    utils.deepExtend(target[key], value);
                    break;
                default :
                    target[key] = value
            }
        }

        return target;
    }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}