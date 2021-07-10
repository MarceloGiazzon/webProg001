function PXToolsDataToFrame()
{

  var thisMe,uc;

	this.render = function()
	{
		///UserCodeRegionStart:[show] (do not remove this comment.)

    thisMe = this.me();
		uc = this;

		console.log('PXToolsDataToFrame Render Start');

		var lastKeyEnter = 0;
		var keyString = '';
    var highFrequencyInputBreakOnMili;
    var vetReadCode = [];

		$(document).keydown(function(e)
		{
			var dttKeyEnter	= new Date().getTime();
			var dif = dttKeyEnter - lastKeyEnter;

			console.log('KeyboardEvents | e.which = ' + e.which
								+ ' e.key = ' + e.key
								+ ' dttKeyEnter = ' + dttKeyEnter
								+ ' dif = ' + dif
							);
			lastKeyEnter = dttKeyEnter;

			if (e.which != 13)
				keyString	+= e.key;

			setTimeout(function()
			{
				var now	= new Date().getTime();
				var difTimeOut = now - lastKeyEnter;
				var count = 1;

				console.log('1 keyString = ' + keyString);
				if (difTimeOut > highFrequencyInputBreakOnMili)
				{
					if (keyString.length > highFrequencyInputMinumunLength)
					{
						var refId = parseInt(Math.random() * 1000000000);
						console.log('Agora Sim! difTimeOut = ' + difTimeOut + ' str = ' + keyString + ' refId = ' + refId);

						vetReadCode.push(keyString);

						//lastSendToWSCheckIndex

						if ((lastSendToWSCheckDtt + 900) > now)	//	if not pending, send to frame now.
						{
							sendToWSCheck(keyString);
							lastSendToWSCheckDtt = now;
							lastSendToWSCheckIndex = vetReadCode.length()-1;
						}
					}
					keyString = '';
				}
			},40);

			var lastLoop;
      var highFrequencyInputBreakOnMili = 30;
      var highFrequencyInputMinumunLength = 3;
			var intervalMinimalToFrame = 1900;
      var lastSendToWSCheckIndex = 0; 

			if (intervalMinimalToFrame > 0)
			setTimeout(function()
			{
				console.log('Loop. vetReadCode.length = ' + vetReadCode.length
									+	' lastSendToWSCheckIndex = ' + lastSendToWSCheckIndex);

				if (vetReadCode.length > lastSendToWSCheckIndex)
				{
					var now	= new Date().getTime();
					var difTimeOut = now - lastSendToWSCheckDtt;

					console.log('Loop. Pending. difTimeOut = ' + difTimeOut);

					if (difTimeOut >= intervalMinimalToFrame)
					{
						lastSendToWSCheckIndex += 1;
						var keyString = vetReadCode(lastSendToWSCheckIndex)
						sendToWSCheck(keyString);
						lastSendToWSCheckDtt = now;
					}
				}
			},250);

		});
		///UserCodeRegionEnd: (do not remove this comment.)
	}
	///UserCodeRegionStart:[User Functions] (do not remove this comment.)

	function sendToFrame() {
		var now	= new Date().getTime();
		var difTimeOut = now - lastSendToFrameDtt;

		if (difTimeOut > 2000)	//	if not pending, send to frame now.
		{
			var keyString = vetCheckedCode[lastSendToFrameIndex]
			//document.getElementById("iframea").src=  + keyString;
			lastSendToFrameDtt = now;
			lastSendToFrameIndex += 1;
		}
	}

	function sendToWSCheck(keyString) {
		//document.getElementById("iframea").src=  + keyString;
		var now	= new Date().getTime();
		var difTimeOut = now - lastSendToWSCheckDtt;

		if (difTimeOut > 2000)	//	if not pending, send to frame now.
		{
			lastSendWSCheckDtt = now;
			lastSendWSCheckIndex = vetReadCode.length()-1;

			sendToFrame(keyString);	//Intent direct after thrigger
		}
	}

	function soapOperation(parmTextSoap,parmURL,frequencyInputString,refId) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', parmURL, true);

		console.log('soapOperation. frequencyInputString = ' + frequencyInputString + ' refId = ' + refId);

		var strRequest = parmTextSoap.replace('[!ReferenceId!]',refId);
		strRequest = strRequest.replace('[!FrequencyInputString!]',frequencyInputString);

		xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4) {
				var dtt	= new Date().getTime();
				var dif = dtt - lastScrollTime;
				console.log('soapOperation. xmlhttp.responseText = ' + xmlhttp.responseText);
				console.log('!soapOperation. response. dtt = ' + dtt + " dif = " + dif);

				if (typeof(uc.OnResponse) == 'function')
				{
					var text = xmlhttp.responseText;
					uc.ReturnResponseString = text;
					uc.OnResponse();
				}
			}
		};

		var dtt	= new Date().getTime();
		var lastScrollTime = dtt;
		console.log('!soapOperation. send. dtt = ' + dtt);
		xmlhttp.send(strRequest);
		var lastScrollTime;
	}
	///UserCodeRegionEnd: (do not remove this comment.):
}
