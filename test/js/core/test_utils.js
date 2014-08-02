/**
 * Created by Valerii Zinchenko on 8/2/14.
 */

suite('Test utility functions', function() {
    test('object cloning', function() {
        var v1 = 11,
            v2 = 4,
            v3 = 19,
            fn = function() {
                this.value = v1;
                this.innObj = {
                    innValue: v2
                };
                return this;
            },
            obj1,
            obj2 = {
                value: v3
            };
        fn.prototype.protoValue = 90;
        obj1 = new fn();

        utils.deepExtend(obj2, obj1);

        assert.equal(obj2.value, v1);
        assert.equal(obj2.innObj.innValue, v2);
        assert.notEqual(obj2.innObj, obj1.innObj);
        assert.isUndefined(obj2.protoValue);
    });
});