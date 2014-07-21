/**
 * Created by valera on 7/21/14.
 */
suite('Test Task model', function() {
    var Module;
    setup(function(done) {
        requirejs(['js/models/Task'], function(Task) {
            Module = Task;
            done();
        })
    });

    test('Default values', function() {
        var model = new Module();

        assert(false === model.get('isDone'),   '"idDone" is not false by default');
        assert('' === model.get('title'),       '"title" is not empty by default');
        assert(1 === model.get('priority'),     '"priority" is not 1 by default');
        assert('' === model.get('description'), '"description" is not empty by default');
        assert(null === model.get('timestamp'), '"timestamp" is not null by default');
    });
});