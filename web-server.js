var host = '0.0.0.0';
var port = 8080;

var fs = require('fs');
var path = require('path');
var http = require('http');

var mimeTypes = {
	'': 'text/plain',
	'.txt': 'text/plain',
	'.html': 'text/html',
	'.manifest': 'text/cache-manifest',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.woff': 'application/font-woff',
	'.woff2': 'application/font-woff2',
	'.jpg': 'image/jpg',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.mp4': 'video/mp4',
	'.ogg': 'video/ogg',
	'.webm': 'video/webm',
	'.vtt': 'text/vtt'
};

function getFile(path, rs, mimeType) {
	fs.readFile(path, function(err, contents) {
		if (err) {
			rs.writeHead(500);
			rs.end();
		} else {
			rs.writeHead(200, {
				'Content-Type': mimeType,
				'Content-Length': contents.length
			});
			rs.end(contents);
		}
	});
}

http.createServer(function(rq,rs) {
	var filename = rq.url;
	if (rq.url === '/') {
		filename = '/index.html';
	}
	var ext = path.extname(filename);
	var localPath = __dirname + filename;

	var mimeType = mimeTypes[ext];

	if (mimeType) {
		fs.exists(localPath, function(exists){
			if (exists) {
				console.log('Serving file: ' + localPath );
				getFile(localPath, rs, mimeType || ext);
			} else {
				console.log('File not found: ' + localPath);
				rs.writeHead(404);
				rs.end();
			}
		});
	} else {
		console.log('Unknown file extensions: ' + ext);
		rs.writeHead(404);
		rs.end();
	}
}).listen(8080, '0.0.0.0');

console.log('Server running at http://' + host + ':' + port + '/');
