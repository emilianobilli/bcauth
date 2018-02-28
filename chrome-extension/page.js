window.onload = function() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(request);
			if (request.to_sign == true) {
				cp = document.getElementById("cp_bcauth_to_sign");	
				if (cp) {
					sendResponse({word: cp.value});
				}
				else	
					sendResponse({word: ""});
			}
			else {
				if (request.signature != "") {
					console.log("Entre");
					cp = document.getElementById("cp_bcauth_to_sign");
					console.log(cp);
					cp.value = request.signature;
				}
			}
      
	});
}