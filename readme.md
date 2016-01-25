[![Build Status](https://travis-ci.org/debitoor/cdnbro.png?branch=master)](https://travis-ci.org/debitoor/cdnbro) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Why
===
* cdn constantly fails, especially cloudfront
* when cdn fails, each asset blocks an execution for 30 sec
* so user gets 90 sec of white screen if you load 3 assets one by one
* we would like to have smaller time out for cdn

Solution
===
* load assets asynchronously
* if cdn times out - load fallback
* mark cdn as failed for 1 day and use fallback sources during that

Example
===

```html
<html>
<head>
	<script>
	window.cdnbro(
		[
			"//dcamghsjgsjl6.cloudfront.net/css/app-aa76b5fb4e.css",
			"//dcamghsjgsjl6.cloudfront.net/libs-07b7cfb48a.js",
			"//dcamghsjgsjl6.cloudfront.net/scripts-7c0c10b50f.js"],
		[
			"/css/app-nocdn-724e4424e4.css",
			"/libs-07b7cfb48a.js",
			"/scripts-7c0c10b50f.js"], 10000);
	</script>
</head>
<body>
	<div class="spinner"></div>
</body>
</html>
```

Tech
===
* assets loaded by xhr to control the order and timeouts
* so scripts should have cors enabled, like cloudfront has
* browser support: ie9+, all recent desktop and mobile
