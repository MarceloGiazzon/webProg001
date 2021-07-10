function PXToolsCompositEvent()
{
	PXToolsCompositEvent.$ = jQuery.noConflict();

  var thisMe,uc;

	this.render = function()
	{
		///UserCodeRegionStart:[show] (do not remove this comment.)

    thisMe = this.me();
		uc = this;

		var activeByHighFrequencyInput = this.ActiveByHighFrequencyInput;
		var generateRandomRequestId = this.GenerateRandomRequestId;
		var highFrequencyInputBreakOnMili = parseInt(this.HighFrequencyInputBreakOnMili);
		var highFrequencyInputMinumunLength = parseInt(this.HighFrequencyInputMinumunLength);
		var webServiceRequestText = this.WebServiceRequestText;
		var webServiceURL = this.WebServiceURL;

    console.log('PXToolsCompositEvent Render Start');

		var lastKeyEnter = 0;
		var keyString = '';

		PXToolsCompositEvent.$(document).keydown(function(e)
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

						if (typeof(uc.OnRequest) == 'function')
						{
							soapOperation(webServiceRequestText,webServiceURL,keyString,refId);
							uc.ReturnRequestString = keyString;
							uc.RequestReferenceId = refId;
							uc.OnRequest();
						}

					}
					keyString = '';
				}
			},40);

		});
		///UserCodeRegionEnd: (do not remove this comment.)
	}
	///UserCodeRegionStart:[User Functions] (do not remove this comment.)

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
