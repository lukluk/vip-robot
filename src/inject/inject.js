chrome.extension.sendMessage({}, function(response) {
	
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			function injectScript(file_path, tag) {
			    var node = document.getElementsByTagName(tag)[0];
			    var script = document.createElement('script');
			    script.setAttribute('type', 'text/javascript');
			    script.setAttribute('src', file_path);
			    node.appendChild(script);
			}
			injectScript(chrome.extension.getURL('js/TA.js'), 'body');			
			injectScript(chrome.extension.getURL('js/EA.js'), 'body');
		}
	})
});