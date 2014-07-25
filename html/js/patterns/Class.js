/**
 * Created by valera on 7/25/14.
 */

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

    if (!Parent) {
        Parent = Object;
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