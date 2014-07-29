/**
 * Created by valera on 7/29/14.
 */

var utils = {
    deepExtend: function(target, source) {
        var key,
            value;

        for (key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }

            value = source[key];
            if (typeof value === 'object') {
                if (!target[key]) {
                    target[key] = {};
                }
                utils.deepExtend(target[key], value);
            } else {
                target[key] = value;
            }
        }
    }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}