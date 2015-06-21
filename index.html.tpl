<!DOCTYPE html>
<html<% if (env == 'PROD') {%> manifest="cache.manifest"<% } %>>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="author" content="Valerii Zinchenko">
    <meta name="description" content="TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.">
    <title>TaskOnFly</title>

	<link rel="stylesheet" href="3rd-party/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
<% if (env == 'PROD') { %>
	<script src="js/all.js" type="text/javascript" charset="utf-8"></script>
<% } else { %>
    <script src="js/require-config.js" type="text/javascript" charset="utf-8"></script>
    <script src="./3rd-party/require.js" data-main='js/all.js' type="text/javascript" charset="utf-8"></script>
<% } %>
</body>
</html>
