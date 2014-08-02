/**
 * Created by Valerii Zinchenko on 7/26/14.
 */

function AClass(Constructor) {
    if (arguments.length === 0) {
        throw new Error('Incorrect input arguments. Constructor function is not defined');
    }
    if (typeof Constructor !== 'function') {
        throw new Error('Constructor should be an function');
    }

    return function(Parent, props){
        var Class, CoreClass, key, value;

        // Check input argumnets
        if (typeof Parent !== 'function') {
            props = Parent;
            Parent = Object;
        }
        if (props && typeof props !== 'object') {
            throw new Error('Incorrect input arguments. It should be: new Class([[Function], Object])');
        }

        // Create proxy function
        CoreClass = function(){};
        CoreClass.prototype = Parent.prototype;

        // Clone class constructor function
        eval('Class = ' + Constructor.toString());
        // Setup class constructor function
        Class.prototype = new CoreClass();
        Class.parent = Parent.prototype;
        Class.prototype.constructor = Class;

        Class.prototype._defaults = {};
        // Clone default properties from parent class
        if (Class.parent._defaults) {
            utils.deepExtend(Class.prototype._defaults, Class.parent._defaults);
        }
        // Setup input properties to the new class
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                value = props[key];
                switch (typeof value) {
                    case 'function':
                        Class.prototype[key] = value;
                        break;
                    case 'object':
                        Class.prototype._defaults[key] = {};
                        utils.deepExtend(Class.prototype._defaults[key], value);
                        break;
                    default :
                        Class.prototype._defaults[key] = value;
                }
            }
        }

        return Class;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AClass;
}