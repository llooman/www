/*
 *  scripts/socketGetMsg.php',"cmd=pv
 * 	
 * 
 *  data['data'] = phpGetAjaxJSONData('scripts/socketGetMsg.php', "cmd=db&"+parms ,'json');
 *  socketRequest($cmd, $start, $stop, $view )
 *  
 * 	getDbData: 	select data from the database to an array. 
 *  		   	when the array is already filled just append the missing periode 
 * 
 */

var phpUrl = 'scripts/socketGetMsg.php';

function isNumeric(n) 
{
	  return !isNaN(parseFloat(n)) && isFinite(n);
}

function storeAndDraw( dataObj, newData )
{
	log( "storeAndDraw"     );

	if( newData[0] == null ) return;   // prevent UI error's when empty data

	dataObj.data  = newData;
	dataObj.start = dataObj.data[0][0]  ; //startDate;
	var lastItem = dataObj.data.length - 1;
	dataObj.stop =  dataObj.data[lastItem ][0]; // stopDate;
	
	dataObj.drawFunc( dataObj );
}
function appendAndDraw  (dataObj, newData )
{
	log( "appendAndDraw"     );
    for(var i = 0; i < newData.length; i++) 
    {
    	if ( newData[i][0] > dataObj.stop ) 
    	{ 
    		dataObj.data.push (newData[i]);
    		dataObj.stop = newData[i][0];
    	}
    }
    dataObj.drawFunc( dataObj );
}
function insertAndDraw  (dataObj, newData )
{
	log( "insertAndDraw"     );
    for (var i = newData.length - 1 ; i >=0; i--) 
    {
    	if (newData[i][0] < dataObj.start ) 
    	{ 
    		dataObj.data.unshift (newData[i]);
    		dataObj.start = newData[i][0];
    	}
    }
    
    dataObj.drawFunc( dataObj );
}

function getDataAndDrawGraph (startDate, stopDate, dataObj)
{
	//log( "data.js>getDataAndDrawGraph:  #tempGraph.length="+$('#tempGraph').length  );	 

	if (_simulate) 
	{ 
		if( dataObj == null ) return;
		if ( dataObj.simulate() == null ) return;
		if ( dataObj.drawFunc() == null ) return;
		dataObj.data = dataObj.simulate();
		dataObj.drawFunc( dataObj );
		return;
	}
	 
	
	var cmd="graph";
	var id = dataObj.id;
 
    if ( dataObj.data == null ) 
    {
    	var parms = startDate+"&"+ stopDate+"&"+id;
    	
    	getJsonDataAndPassBuff( cmd, parms, dataObj, storeAndDraw );
    	 
    } 
    else 
    {
    	var drawing = false;
    	
    	if ( stopDate > dataObj.stop ) 
    	{
    		//console.log('drawGraph>: startDate='+startDate+', stopDate='+stopDate);
    		var parms = dataObj.stop.valueOf()+"&"+ stopDate+"&"+id;
     		
    		getJsonDataAndPassBuff( cmd, parms, dataObj, appendAndDraw  );
    		drawing = true;
    	}	
        if (startDate < dataObj.start ) 
    	{
    		//console.log('drawGraph<: startDate='+startDate+', stopDate='+stopDate);
    		var parms = startDate+"&"+ dataObj.start.valueOf()+"&"+id;
 
    		getJsonDataAndPassBuff( cmd, parms, dataObj, insertAndDraw  );
    		drawing = true;
    	}
    	if(!drawing)
    	{
    		dataObj.drawFunc( dataObj );
    	}
    }
}


function getJsonData ( cmd, arrivedDataFunc ) 
{   
	var returnValue = null;
	var error = false;	
	var strUrl = 'http://'+window.location.hostname+':9000/'+cmd ;
	
	if( window.location.port == 3000 )
	{
		strUrl =  'http://'+window.location.host+'/'+cmd;
	}
	else
	{
		strUrl = phpUrl;
		parms  = cmd;
	}

	//alert('url='+strUrl+' parms'+parms);
    log('getJsonData: url='+strUrl+', parms='+parms);

	$.ajax({
		  url: strUrl 
		, async: true
		, cache : false
		, type : "GET"
		, dataType : "json"
		, data : parms
		, timeout : 3000
		, success : function( newData )
		{ 
			//alert('doJsonCmd newData='+newData);
			if(arrivedDataFunc != null) arrivedDataFunc (cmd, newData );
		}
		, error: function( data )
		{ 
			error = true;
			if(!refreshError)
			{
				alert("getJsonData: url="+strUrl+", parms="+parms+", data="+ data);
				refreshError = true;
			}
 
		}
	});
}


//pass nodeid as parm for beter re-use based on nodeId
function doJsonCmd ( cmd, parms, arrivedDataFunc ) 
{   
	if (parms == null) 
	{ 
		parms = ""; 
		alert('doJsonCmd: no parms!'); 
		return null;
	}	 

	var returnValue = null;
	var error = false;	
	var strUrl = 'http://'+window.location.hostname+':9000/'+cmd ;
	
	if( window.location.port == 3000 )
	{
		strUrl =  'http://'+window.location.host+'/'+cmd;
	}
	else
	{
		strUrl = phpUrl;
		parms  = cmd+'&'+parms;
	}

	//alert('url='+strUrl+' parms'+parms);

    log('doJsonCmd: url='+strUrl+', parms='+parms);
	$.ajax({  url: strUrl 
			, async: true
			, cache : false
			, type : "GET"
			, dataType : "json"
			, data : parms
			, timeout : 3000
			, success : function( newData )
			{ 
				//alert('doJsonCmd newData='+newData);
				if(arrivedDataFunc != null) arrivedDataFunc (cmd, newData );
			}
			, error: function( data )
			{ 
				error = true;
				if(!refreshError)
				{
					alert("doJsonCmd: error"+ data);
					refreshError = true;
				}
	 
			}
	});
}

//pass dataBuf as parm so the new data can be added. Used for Graph
function getJsonDataAndPassBuff ( cmd, parms, dataBuf, arrivedDataFunc ) 
{
   // TODO always async so remove code
	if (parms == null) 
	{ 
		parms = ""; 
		alert('doJson4: no parms!'); 
		return null;
	}	 

	var returnValue = null;
	var async = true;
	var error = false;
	if (arrivedDataFunc == null )
	{
		alert('doJson4: no arrivedDataFunc!'); 
		return null; 
	}
 	
	//log( "doJson4 cmd:" +cmd+ ", parms:"+parms);
	
	var strUrl = 'http://'+window.location.hostname+':9000/'+cmd ;
	
	if( window.location.port == 3000 )
	{
		strUrl =  'http://'+window.location.host+'/'+cmd;
	}
	else
	{
		strUrl = phpUrl;
		parms  = cmd+'&'+parms;
	}

	//alert('parms='+parms);
	//console.log('getJson3: cmd='+cmd+', parms='+parms);
	$.ajax({
		  url: strUrl 
		, async: async
		, cache : false
		, type : "GET"
		, dataType : "json"
		, data : parms
		, timeout : 3000
		, success : function( newData ) { 
			
			if (  async )
				arrivedDataFunc (dataBuf, newData );
			else
				returnValue = data ; 
		}
		, error: function( data ) { 
			error = true;
			if(!refreshError)
			{
				alert("doJson4: error"+ data);
				refreshError = true;
			}
		}
	});
	
	if( ! async && ! error ) return  returnValue;
}




// pass dataBuf as parm so the new data can be added. Used for Graph
function doJson4 ( cmd, parms, dataBuf, arrivedDataFunc ) 
{
   // TODO always async so remove code
	if (parms == null) 
	{ 
		parms = ""; 
		alert('doJson4: no parms!'); 
		return null;
	}	 

	var returnValue = null;
	var async = true;
	var error = false;
	if (arrivedDataFunc == null )
	{
		alert('doJson4: no arrivedDataFunc!'); 
		return null; 
	}
 	
	//log( "doJson4 cmd:" +cmd+ ", parms:"+parms);
	
	var strUrl = 'http://'+window.location.hostname+':9000/'+cmd ;
	
	if( window.location.port == 3000 )
	{
		strUrl =  'http://'+window.location.host+'/'+cmd;
	}
	else
	{
		strUrl = phpUrl;
		parms  = cmd+'&'+parms;
	}

	//alert('parms='+parms);
	//console.log('getJson3: cmd='+cmd+', parms='+parms);
	$.ajax({
		  url: strUrl 
		, async: async
		, cache : false
		, type : "GET"
		, dataType : "json"
		, data : parms
		, timeout : 3000
		, success : function( newData ) { 
			
			if (  async )
				arrivedDataFunc (dataBuf, newData );
			else
				returnValue = data ; 
		}
		, error: function( data ) { 
			error = true;
			if(!refreshError)
			{
				alert("doJson4: error"+ data);
				refreshError = true;
			}
		}
	});
	
	if( ! async && ! error ) return  returnValue;
}

 



 
 	
