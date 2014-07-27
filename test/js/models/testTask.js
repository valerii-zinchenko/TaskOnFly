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
    teardown(function() {
        Module._counter = 0;
    });

    test('Constructor without arguments', function() {
        assert.throw(function() {
            new Module();
        }, Error, 'Path is not defined');
    });
    test('Constructor with path', function() {
        assert.equal((new Module('L0')).public.path, 'L0/T0');
    });

    test('Constructor with unaccepted data', function() {
        assert.throw(function() {
            new Module('', 0);
        }, Error, 'Data should be an object');
    });
    test('Constructor with accepted data', function() {
        var path = 'L0/L2',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = new Date();

        var task = new Module(path, {
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp
        });

        assert.equal(task.public.path, (path + '/T0'));
        assert.equal(task.public.isDone, isDone);
        assert.equal(task.public.title, title);
        assert.equal(task.public.priority, priority);
        assert.equal(task.public.description, description);
        assert.equal(task.public.timestamp, timestamp);
    });

    test('Save data function', function() {
        var path = 'L0/L2',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = new Date();

        var task = new Module(path);
        task.saveData({
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp
        });

        assert.equal(task.public.isDone, isDone);
        assert.equal(task.public.title, title);
        assert.equal(task.public.priority, priority);
        assert.equal(task.public.description, description);
        assert.equal(task.public.timestamp, timestamp);
    });

    test('Is Module a singleton?', function() {
        assert.notEqual(new Module(''), new Module(''));
    });
});