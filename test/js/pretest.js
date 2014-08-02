/**
 * Created by Valerii Zinchenko on 8/1/14.
 */

jscoverage = require('jscoverage');

srcPrefix =  './html/js/';
destPrefix = './test/_jsTestFiles/js/';

[
    'core/AClass.js',
    'core/Class.js',
    'core/SingletonClass.js',
    'core/TaskMe.js',
    'core/utils.js',

    'collections/TaskList.js',

    'models/Task.js',

    'routers/MainRouter.js',

    'views/HomeView.js',
    'views/TaskView.js',

    'main.js'
].forEach(function(file) {
    jscoverage.processFile(srcPrefix + file, destPrefix + file);
});
