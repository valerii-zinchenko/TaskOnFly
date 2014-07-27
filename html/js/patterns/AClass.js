/**
 * Created by valera on 7/26/14.
 */

function AClass(Constructor) {
    if (arguments.length === 0) {
        throw new Error('Incorrect input arguments. Constructor function is not defined');
    }
    if (typeof Constructor !== 'function') {
        throw new Error('Constructor should be an function');
    }
    return function(Parent, props){
        var FutureClass, Class, i;

        // Check input argumnets
        if (typeof Parent !== 'function') {
            props = Parent;
            Parent = Object;
        }
        if (props && typeof props !== 'object') {
            throw new Error('Incorrect input arguments. It should be: new Class([[Function], Object])');
        }

        // Create proxy function
        Class = function(){};
        Class.prototype = Parent.prototype;

        // Clone class constructor function
        eval('FutureClass = ' + Constructor.toString());
        // Setup class constructor function
        FutureClass.prototype = new Class();
        FutureClass.parent = Parent.prototype;
        FutureClass.prototype.constructor = FutureClass;

        // Setup input properties to the new class
        for (i in props) {
            if (props.hasOwnProperty(i)) {
                FutureClass.prototype[i] = props[i];
            }
        }

        return FutureClass;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AClass;
}