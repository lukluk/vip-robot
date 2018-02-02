const URL = 'https://api2.bitcoin.co.id/tradingview/history?'
const timeframe = [1,5,15,60,'D']
var EA = {}
var TA = {}
var indicator = {}
Alert = {}
Alert.me = function(message){
	Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
}
indicator.BB = function (SYM,TS,PERIOD){
	if(!PERIOD) PERIOD = 14
	data = price.get(SYM,TS,PERIOD)	
	let  upper = TA.bollingerBands(price.mapArrayClose(data),PERIOD,2).upper.reverse()
	let  middle = TA.bollingerBands(price.mapArrayClose(data),PERIOD,2).middle.reverse()
	let  lower = TA.bollingerBands(price.mapArrayClose(data),PERIOD,2).lower.reverse()
	return {
		u : upper[0],
		m : middle[0],
		l : lower[0]
	}
}
var price = {}
	price.now = {}
	price.now.close = 0
	price.now.open = 0
	price.now.high = 0
	price.now.low = 0
	price.now.volume = 0
	price.touch = function(targetVal){
		if(price.now.close >= targetVal){
			return true
		}
		return false
	}
	price.updateVal = function(json){
		let current = JSON.parse(json)
		price.now = current
	}
	price.mapArrayClose = function(data){
		var result = []
		data.forEach(function(p){
			result.push(p.close)
		})
		return result
	}
	price.get = function(SYM,TS,candle){
		if(!candle) candle = 1
		if(timeframe.indexOf(TS)<0){
			console.log("TS not valid")
			return false
		}
		let timeStamp = Math.floor(Date.now() / 1000);
		let timeStampFrom = timeStamp - (TS*60*candle)
		jQuery.ajaxSetup({
    		async: false
		});

		var jsonData = (function() {
    		let result;
			jQuery.getJSON(URL+"symbol="+SYM+"&resolution="+TS+"&from="+timeStampFrom+"&to="+timeStamp,function(data){
				var r = []
				data.c.forEach(function(c,i){
					let o = {}
					o.close = data.c[i]
					o.open = data.o[i]
					o.high = data.h[i]
					o.low = data.l[i]	
					r.push(o)				
				})
				result = r;
			})
			return result	
		})()

		jQuery.ajaxSetup({
    		async: true
		});
		return jsonData
	}

	EA.start = function (){		
		TA = new TechnicalAnalysis()
		function log() {
		    		var i;
		    		var max = -Infinity;
		    		for (i = 0; i < arguments.length; i++) {        		
		        		if(arguments[i].indexOf("onTick")>0){
		        			let json = arguments[i].split('[').pop().split(']').shift()
		        			price.updateVal(json)
		        			EA.onTick && EA.onTick()
		        		}else{
		        			console.log(arguments[i])
		        		}
		    		}
		}
		document.querySelector('[id*=tradingview]').contentWindow.console.log = log
	}