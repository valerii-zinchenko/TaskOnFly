/**
 * Created by Valerii Zinchenko on 8/2/14.
 */

suite('Test main file', function() {
    var Module;
    setup(function(done) {
        requirejs(['js/main'], function(Task) {
            Module = Task;
            done();
        })
    });

    test('Application start', function() {
        assert.doesNotThrow(function() {
            Module();
        });
    })
});