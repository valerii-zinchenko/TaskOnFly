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

    test('Constructor without arguments', function() {
        var err = 0;
        try {
            new Module();
        } catch(e) {
            if (e.constructor === Error) {
                err++;
            }
            if (e.message === 'Path is not defined') {
                err++;
            }
        }
        assert(2 === err);
    });
    test('Constructor with path', function() {
        assert('L0/T0' === (new Module('L0')).get('path'));
    });

    test('Constructor with unaccepted data', function() {
        var err = 0;
        try {
            new Module('', 0);
        } catch(e) {
            if (e.constructor === Error) {
                err++;
            }
            if (e.message === 'Data should be an object') {
                err++;
            }
        }
        assert(2 === err);
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

        assert((path + '/T0') === task.get('path'));
        assert(isDone === task.get('isDone'));
        assert(title === task.get('title'));
        assert(priority === task.get('priority'));
        assert(description === task.get('description'));
        assert(timestamp === task.get('timestamp'));
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

        assert(isDone === task.get('isDone'));
        assert(title === task.get('title'));
        assert(priority === task.get('priority'));
        assert(description === task.get('description'));
        assert(timestamp === task.get('timestamp'));
    });

    test('Is Module a singleton?', function() {
        assert(new Module('') !== new Module(''));
    });
});