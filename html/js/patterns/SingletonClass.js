/**
 * Created by valera on 7/21/14.
 */

function SingletonClass(Parent, props) {
    var instance = null,
        initialize = props.initialize;

    props.initialize = function() {
        if (instance) {
            return instance;
        }
        instance = this;

        initialize.apply(this, arguments);

        return instance;
    };

    return new Class(Parent, props);
}