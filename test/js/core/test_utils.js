/**
 * Created by Valerii Zinchenko on 8/2/14.
 */

suite('Test utility functions', function() {
    test('object cloning', function() {
        var v1 = 11,
            v2 = 4,
            v3 = 19,
            obj1 = {
                value: v1,
                innObj: {
                    innValue: v2
                }
            },
            obj2 = {
                value: v3
            };

        utils.deepExtend(obj2, obj1);

        assert.equal(obj2.value, v3);
        assert.equal(obj2.innObj.innValue, v2);
        assert.notEqual(obj2.innObj, obj1.innObj);
    });
});