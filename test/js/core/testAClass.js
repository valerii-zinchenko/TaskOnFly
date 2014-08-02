/**
 * Created by Valerii Zinchenko on 7/27/14.
 */

suite('Class. General.', function() {
    suite('Input arguments', function() {
        test('No arguments', function() {
            assert.throw(function() {
                new AClass();
            }, Error, 'Incorrect input arguments. Constructor function is not defined');
        });
        test('Single argument', function() {
            assert.doesNotThrow(function() {
                new AClass(function() {});
            });
            assert.throw(function() {
                new AClass(2);
            }, Error, 'Constructor should be an function');
        });
    });
});