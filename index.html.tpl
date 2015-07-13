<!DOCTYPE html>
<html<% if (env == 'PROD') {%> manifest="cache.manifest"<% } %>>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="author" content="Valerii Zinchenko">
    <meta name="description" content="TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.">
    <title>TaskOnFly</title>

	<link rel="shortcut icon" href="favicon.png" type="image/png">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
<% var pages = ['home', 'editor', 'about']; %>
<% var progressSteps = pages.length + 1 + 1; // 1 for scripts; 1 for app statr %>
<div id="loading" class="container-fluid">
	<div class="progress">
		<div id="progressBar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
	</div>
</div>
<script>
	var progressBar = document.getElementById('progressBar');
	var progress = 0;
	var total = <%= progressSteps %>;
</script>

<% pages.forEach(function(page, index) { %>
	<div id="<%= page %>" class="page hidden">
		<%= insertHTML('html/pages/' + page + '.html') %>
	</div>
	<script>
		progress = <%= index+1 %>/total * 100;
		progressBar.style.width = progress + "%";
		progressBar.setAttribute("aria-valuenow", progress);
	</script>
<% }, this); %>

<% if (env == 'PROD') { %>
	<script src="js/all.js" type="text/javascript" charset="utf-8"></script>
<% } else { %>
	<script src="./3rd-party/require.js" type="text/javascript" charset="utf-8"></script>

	<script src="./js/core/utils.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/AClass.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/Class.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/SingletonClass.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/AStateComponent.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/AControl.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/AView.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/StaticView.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/DynamicView.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/AState.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/EventHandler.js" type="text/javascript" charset="utf-8"></script>
	<script src="./js/core/MVCModule.js" type="text/javascript" charset="utf-8"></script>

	<script>
		requirejs.config({
			baseUrl: "js"
		});

		requirejs([
			'./3rd-party/jquery.js',
			'./3rd-party/underscore.js'
		], function(){
			requirejs([
				'./3rd-party/bootstrap.js',
				'./3rd-party/backbone.js'
			], function(){
				requirejs([
					"boot"
				], function(){});
			});
		});
	</script>
<% } %>

	<script>
		var progress = (total-1)/total * 100;
		progressBar.style.width = progress + "%";
		progressBar.setAttribute("aria-valuenow", progress);
	</script>
</body>
</html>
