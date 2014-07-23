/**
 * Created by valera on 7/21/14.
 */
suite('Test Tasks collection', function() {
    var Module;
    setup(function(done) {
        requirejs(['js/collections/Tasks'], function(Tasks) {
            Module = Tasks;
            done();
        })
    });

    test('Is singleton?', function() {
        assert(new Module() !== new Module());
    });
});