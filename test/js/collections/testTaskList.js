/**
 * Created by valera on 7/21/14.
 */
suite('Test TaskList', function() {
    var Module;
    setup(function(done) {
        requirejs(['js/collections/TaskList'], function(TaskList) {
            Module = TaskList;
            done();
        })
    });
    teardown(function() {
        Module._counter = 0;
    });

    test('Constructor with path', function() {
        var parentID = 'parentID';
        assert.equal((new Module(parentID)).public.parentID, parentID);
    });

    test('Constructor with accepted data', function() {
        var parentID = 'parentID',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = new Date();

        var task = new Module(parentID, {
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp
        });

        assert.equal(task.public.parentID, parentID);
        assert.equal(task.public.isDone, isDone);
        assert.equal(task.public.title, title);
        assert.equal(task.public.priority, priority);
        assert.equal(task.public.description, description);
        assert.equal(task.public.timestamp, timestamp);
    });

    test('Save data function', function() {
        var parentID = 'parentID',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = new Date();

        var task = new Module(parentID);
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
        assert.notEqual(new Module('id'), new Module('id'));
    });
});