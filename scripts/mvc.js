
function nodeId2Name(nodeId)
{
	if(nodeId==1) return "Conn";
	if(nodeId==2) return "Kernel";
	if(nodeId==3) return "Pomp";
	if(nodeId==4) return "Dimmer";
	if(nodeId==5) return "Ketel";
	if(nodeId==6) return "Gas";
	if(nodeId==8) return "CloseIn";
	if(nodeId==10) return "Tcp";
	if(nodeId==11) return "Serial1";
	if(nodeId==12) return "Serial2";
	if(nodeId==13) return "Ttn";	
	if(nodeId==14) return "Chint";	
	if(nodeId==18) return "Hub";	
	if(nodeId==20) return "Water";	
	if(nodeId==21) return "Verwarm";	
	if(nodeId==22) return "Fan";	
}


function toggleVisibility(id)
{ 
	if ($('#'+id).css('visibility') == 'visible')
	{		 
		$('#'+id).css("visibility", "hidden");
		$('#'+id).css("display", "none");
		$('#'+id).hide();
	}
	else
	{		 
		$('#'+id).css("display", "block");
		$('#'+id).css("visibility", "visible");
		$('#'+id).hide().show(0); 
	}			
}

var delayVar=null;
function doDelay(func, periode)
{
	if(typeof(func)!='function')
	{
		periode=func;
		func=showDetails2;
	}
	if(!periode)periode=400;
	//logg(1,"doDelay periode="+periode );
 
	delayVar = setTimeout(function(){func();clearTimeout(delayVar);}, periode);
}

function sendCmd(cmd, parm, delay, func )
{
	//logg(1,"sendCmd cmd="+cmd+" parm="+parm);
	doJsonCmd( cmd, parm);
	
	if(typeof(delay)=='function') delay=400;
	doDelay(func, delay);	
}

function sendParm2(node, parm, newVal )
{
	//logg(1,'sendParm2 node='+node+' parm='+parm+' newVal='+newVal);
	//doJson2( node, parm+'&'+newVal||'', true );	
	doJsonCmd( node, parm+'&'+newVal||'');
}

function setParm2(node, id, delta)
{
	//logg(1,'setParm2 id='+id+' delta='+delta);
	var inputField = $('input#'+id);
	var currentval = inputField.attr('currentvalue')	
	var type = inputField.attr('type');

	var newVal;
	if(type=='checkbox')
	{
		newVal = inputField.is(':checked')?1:0; 
		if( newVal == currentval ) return;
		//logg(1,'setParm2 id='+id+' newVal='+newVal);
	}
	else
	{
		newVal = inputField.val();
		logg(1,'setParm2 node='+node+' id='+id+' newVal='+newVal);
		if( newVal && newVal == currentval && delta == null ) return;
		newVal = new Number ( newVal ) ;
		if (delta && newVal) newVal = newVal + new Number( delta); 
	}
			
	//if (newVal)
	{
		//logg(1,'setParm2.doJsonCmd id='+id+' newVal='+newVal);
		doJsonCmd( node, id+'&'+newVal||'' );	
	}
}





function showNode( nodeId, clearError )
{
	//busyCursor();  $('a#detailName').text( nodeName )
	//alert("showNode"); 
	//if(nodeId=='4')logg(1,'showNode nodeId='+nodeId  );
	doJsonCmd( nodeId, "mvc", function ( cmd, info )
	{ 
		// mvcInfo( mvcInfo, clearError );
		
		if( info.retCode < 0)
		{
			var errMsg = "showNode.mvc: "+ info.message;
			if(clearError)
				mvcSet2('mvcError', errMsg);  
	    	else
	    		mvcAppend('mvcError', errMsg);
		}
		else   
			 if( clearError ) mvcSet2('mvcError', ""); 
		
		
		$.each( info.mvc, function(key,value)
		{
			var id = value.i;

			if(id.substring(0,5) == 'radio')
			{			 
				mvcRadio( id, value.v, value.t ); 
			}
			else if(id=='caption')
			{
				$('a#detailName').text( value.v );
				$('a#caption').text( value.v );
			}
			else
			{
				mvcSet2( id, value.v, value.c );
				setRecent(id, value.r);
			}
		}); 		
	});
} 


function showNodeLog(nodeId, parm)
{ 
	var clearError = false;
	doJsonCmd( nodeId, "log&"+parm, function ( cmd,  info )
			{
   				//alert("showLog"+info); 
					
				if( info.retCode < 0)
				{
				 
					alert("showLog error "+info.message); 
					return;
 
				}	
 
				var prevDD=0;
				$("#ardLog > tbody").empty();
						
				$.each( info.log, function(idx, logLine)
				{
					var tr = '<tr><td>'+logLine.at+'</td><td>'+logLine.o+'</td><td>'+logLine.v+'</td></tr>';
 
					var DD  = logLine.dd;
					if(prevDD != DD)
					{
						if(DD == 1)
						{
							$('#ardLog > tbody:last-child').append('<tr><td colspan="3" align="center">Gisteren</td></tr>');
						}
						else
						{
							$('#ardLog > tbody:last-child').append('<tr><td colspan="3" align="center">'+DD+' dagen geleden</td></tr>');
						}
					}
			
					$('#ardLog > tbody:last-child').append(tr);
					
				   	prevDD = DD;
					
				   	/*  				 */	 
				}); 		
		   
			});   
}


function showLog(id, parm)
{ 
	var clearError = false;
	doJsonCmd( id, "log"+parm  
			, function ( cmd,  info )
			{
   				//alert("showLog"+info); 
					
				if( info.retCode < 0)
				{
				 
					alert("showLog error "+info.message); 
					return;
 
				}	
 
				var prevDD=0;
				$("#ardLog > tbody").empty();
						
				$.each( info.log, function(idx, logLine)
				{
					var tr = '<tr><td>'+logLine.at+'</td><td>'+logLine.o+'</td><td>'+logLine.v+'</td></tr>';
 
					var DD  = logLine.dd;
					if(prevDD != DD)
					{
						if(DD == 1)
						{
							$('#ardLog > tbody:last-child').append('<tr><td colspan="3" align="center">Gisteren</td></tr>');
						}
						else
						{
							$('#ardLog > tbody:last-child').append('<tr><td colspan="3" align="center">'+DD+' dagen geleden</td></tr>');
						}
					}
			
					$('#ardLog > tbody:last-child').append(tr);
					
				   	prevDD = DD;
					
				   	/*  				 */	 
				}); 		
		   
			});   
}

function showLog2(cmd, parm)
{ 
	var clearError = false;
	doJsonCmd( cmd,  parm, function ( cmd, info )
	{
		//alert("showLog"+info); 
			
		if( info.retCode < 0)
		{
		 
			alert("showLog error "+info.message); 
					return;
 
				}	
 
				var prevDD=0;
				$("#ardLog > tbody").empty();
		//$('#ardLog tbody').remove();
				
		$.each( info.log, function(idx, logLine)
		{
			var tr = '<tr><td>'+logLine.at+'</td><td>'+logLine.f+'</td><td>'+logLine.o+'</td><td>'+logLine.v+'</td></tr>';
 
					var DD  = logLine.dd;
					if(prevDD != DD)
					{
						if( DD == 1)
						{
							$('#ardLog > tbody:last-child').append('<tr><td colspan="3" align="center">Gisteren</td></tr>');
				}
				else
				{
					$('#ardLog > tbody:last-child').append('<tr><td colspan="3" align="center">'+DD+' dagen geleden</td></tr>');
				}
			}
	
			$('#ardLog > tbody:last-child').append(tr);
			
		   	prevDD = DD;
			
		   	/*  				 */	 
		}); 		
   
	});   
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function mvcSet2(id, val, color) 
{		
	//if(id=='s450')logg(0,'mvcSet2 id='+id+' val='+val);	
	if(id.substring(0,4) == 'bool')
	{
		val = val?'aan':'uit';
	}
	
    {    	 
    	$('span#'+id).text( val );
    	$('div#'+id).text( val );
    	$("input#"+id+"[type='text']").val( val );
    	$("input#"+id+"[type='text']").attr("currentvalue", val );    	
    }	
    
    if(typeof val =='number')
    //if(isNumber(val))
    {
    	$("input#"+id+"[type='number']").val( val );    	
    	$("input#"+id+"[type='number']").attr("currentvalue", val );    	

    	$("input#"+id+"[type='range']").val( val );
    	$("input#"+id+"[type='range']").attr("currentvalue", val );

    	$('span#'+id).text( val );
    	$('div#'+id).text( val );
    	$('span#'+id).text( val );
    	$("span#"+id+"[type='boolean']").each(function()
		{
    		if(val>0)
    		{
        		var trueText = $(this).attr('true');
        		if(trueText) $(this).text(trueText);	
    		}
        	else
    		{
        		var falseText = $(this).attr('false');
        		if(falseText) $(this).text(falseText);		
    		}    		
		}); 
  		
    }
   // else


	
	if(color != null )
	{
		$('div#'+id).css('background',color);
		$('span#'+id).css('background',color);
		$('input#'+id).css('background',color);
	}
	
	var checkField = $("input#"+id+"[type='checkbox']");
	if(checkField)
	{
		var check=false;
		if( typeof val == "string") if(val=='true') check=true;
		if( typeof val == "string") if(val=='aan') check=true;
		if( typeof val == "number") if(val>0) check=true;
		if( typeof val == "boolean") if(val) check=true;
		
		currCheckVal = checkField.is(':checked')
		//if(id=='s50')logg(1,'mvcSet2 check='+check+' currCheckVal='+currCheckVal );
		if(check != currCheckVal)
		{
			if(check)
			{
				//if(id=='s50')logg(1,'mvcSet2 id='+id+' checked=true' );
				$("input#"+id+"[type='checkbox']").prop('checked', true);
			}
			else
			{
				//if(id=='s50')logg(1,'mvcSet2 id='+id+' checked=false' );
				$("input#"+id+"[type='checkbox']").prop('checked', false);
			}		
		}
	}

}

function setRecent(id, recent)
{
	if(recent==null || recent<1)
	{
		$('div#'+id).removeClass("recent1");
		$('span#'+id).removeClass("recent1");
		$('div#'+id).removeClass("recent2");
		$('span#'+id).removeClass("recent2");
		$('div#'+id).removeClass("recent3");
		$('span#'+id).removeClass("recent3");
		return;
	}
	if(recent==1)
	{
		$('div#'+id).addClass("recent1");
		$('span#'+id).addClass("recent1");
		return;
	}
	if(recent==2)
	{
		$('div#'+id).addClass("recent2");
		$('span#'+id).addClass("recent2");
		return;
	}
	if(recent==3)
	{
		$('div#'+id).addClass("recent3");
		$('span#'+id).addClass("recent3");
		return;
	}
}


function mvcRadio(id, varValue, timestamp, periode) 
{
	try
	{
        //alert("radioDimmer");
		$('input:radio[name=radioDimmer][value='+varValue+']').prop('checked', true);

	} catch (e) {}
}	


function mvcSet(id, varValue, timestamp, periode, recent, color) 
{
	try{
		$('span#'+id).text( varValue );
		$('div#'+id).text( varValue );
		$('input#'+id).val( varValue );
		$('input#'+id).attr("currentvalue", varValue );

		{
			if(color != null )
			{
				$('div#'+id).css('background',color);
				$('span#'+id).css('background',color);
				$('input#'+id).css('background',color);
			}
		}
		
		
	} catch (e) {}
}

 

function showMvc( soort, async, clearError )
{
	doJsonCmd(  "mvc", soort, function (cmd, info)	 
	{ 
		
		if( info.retCode < 0)
		{
			var errMsg = "mvc.showMvc: "+ info.message;
			if(clearError)
				mvcSet2('mvcError', errMsg);  
	    	else
	    		mvcAppend('mvcError', errMsg);
		}
		else   
			 if( clearError ) mvcSet2('mvcError', ""); 
		
		
		$.each( info.mvc, function(key,value)
		{
			var id = value.i;

			if(id.substring(0,5) == 'radio')
			{			 
				mvcRadio( id, value.v, value.t ); 
			}
			else
			{
				mvcSet2( id, value.v, value.c); 
				setRecent(id, value.r);
			}
		}); 		
	});
} 
 
function showSensorDetails( cmd, parm1, async, clearError )
{
	//busyCursor();
	//if (window.console) console.log( 'showSensorDetails cmd='+cmd+' parm1='+parm1 );
 	
	doJsonCmd( cmd, parm1, function (cmd, info) 
	{ 
		// mvcInfo( mvcInfo, clearError );
		
		if( info.retCode < 0)
		{
			var errMsg = "mvc.showSensorDetails: "+ info.message;
			if(clearError)
				mvcSet2('mvcError', errMsg);  
	    	else
	    		mvcAppend('mvcError', errMsg);
		}
		else   
			 if( clearError ) mvcSet2('mvcError', ""); 
		
		
		$.each( info.sensor, function(key,value)
		{
			
			 //		 { "sensor": {
		 	//	"1": ["id", 123] 
		 	//	,"2": ["name", "abc1"] 
		 	//	,"3": ["Dal2", "abc2"]
		 	//    }  } 					
					
			var id = value[0];
			var val = value[1];
 
			logg(1, 'showSensors id='+id+' val='+val );

			//if(id.substring(0,5) == 'radio')
			//{			 
			//	mvcRadio( id, val, null ); 
			//}
			//else
			//{
				mvcSet2( id, val );
			//}
		}); 		
	});	 
} 

function drawTableFromArray(cmd, filter)
{ 
	var clearError = false;
	//alert("drawTableFromArray "+cmd+"&"+filter); 
	doJsonCmd( cmd,  filter, function (cmd, data)
	{
		//alert("showLog"+info); 
			
		if( data.retCode < 0)
		{
			alert("drawTableFromArray error:"+data.message); 
			return; 
		}	

		
		$("#showTable > tbody").empty();
 

		for(firstItem in data); /* trick proces only the first skip the rest */
		
		
		var arr = data[firstItem];
		
		$.each( arr, function(idx, rec)
		{
			var tr = '';  
			
			if(idx==0) /* show headers */
			{
				tr = '<tr>'
			    for (field in rec)
			    { 
			    	tr += '<td>'+field+'</td>';   
			    }
				
				$('#showTable > tbody:last-child').append(tr+'</tr>');	
				
			    tr = '';				
			}
									 
			var count = 0;
		    for (field in rec)  /* show all fields in the rec */
		    {
		    	count++;
		    	var value = rec[field];   
		    	if(count==1)
	    		{
		    		 tr += "<tr onclick=\"rowClick('"+value+"');\">";
				    // alert(field + "=" + value);  		    		
	    		}
			        
			    tr += '<td>'+value+'</td>';  	    	
		    }			 
		    
			$('#showTable > tbody:last-child').append(tr+'</tr>');
 
		}); 		   
	});   
}

function drawDataFromArray( cmd, parm1, clearError )
{
 	
	doJsonCmd( cmd, parm1, function (cmd, data) 
	{ 		
		if( data.retCode < 0)
		{
			var errMsg = "mvc.showSensorDetails: "+ info.message;
			if(clearError)
				mvcSet2('mvcError', errMsg);  
	    	else
	    		mvcAppend('mvcError', errMsg);
		}
		else   
			 if( clearError ) mvcSet2('mvcError', ""); 

		
		for(firstJsonItem in data); /* trick proces only the first skip the rest */
		
		
		var arr = data[firstJsonItem]; 
		var rec =  arr[0];

	    for (field in rec)  /* show all fields in the rec */
	    {
	    	var value = rec[field];   		    
		    mvcSet2( field, value );
	    }						
 	
	});	 
} 


function showTable(cmd, parm)
{ 
	var clearError = false;
	//alert("showTable "+cmd+"&"+parm); 
	doJsonCmd( cmd,  parm, function (cmd, info)
	{
		//alert("showLog"+info); 
			
		if( info.retCode < 0)
		{
		 
			alert("showLog error "+info.message); 
					return;
 
		}	
 
			  
		$("#showTable > tbody").empty();
		//$('#ardLog tbody').remove();
		
		//alert("showTable  sensor="+info.sensor  ); 
		
		$.each( info.rows, function(idx, logLine)
		{
			var tr = ''; // <td>'+idx+'</td><td>'+info.rows[idx][2]+'</td></tr>';
	
		//	for (var i = 1; i < info.rows[idx].length; i++) 
		//	{
		//	    tr += '<td>'+ info.rows[idx][i]+'</td>';   
		//	}
		    var object = info.rows[idx];
		    var count = 0;
		    for (property in object)
		    {
		    	count++;
		    	var value = object[property];
		    	if(count==1)
	    		{
		    		 tr += '<tr onclick="'+value+'">';
	    		}
		    	else
	    		{
			        
			        tr += '<td>'+value+'</td>';  
			        //alert(property + "=" + value); // This alerts "id=5",  etc..			    		
	    		}
		    }
			
			
			tr += '</tr>';
			$('#showTable > tbody:last-child').append(tr);

		}); 		
   
	});   
}

function mvcAddSpan(id, varValue) {
	$('span#'+id).text( varValue );
}
function mvcAddDiv(id, varValue) {
	$('div#'+id).text( varValue );
}
function mvcAddInput(id, varValue) {
	$('input#'+id).val( varValue );
	$('input#'+id).attr("currentvalue", varValue );
}

function mvcVisible( inputId , val ) {
	
	if ( typeof val == "string")  val = ( val == 'true' );
	
	if ( val )  
		$( '#'+inputId ).prop('checked', true ) ; 
	else 
	    $( '#'+inputId ).prop('checked', false )  ; 		
	
	//alert('setCheck checked='+ $( '#'+inputId ).prop( "checked" )  );
}

function mvcAppend(id, varValue) {
	try{
		$('span#'+id).text( $('span#'+id).text() +', '+ varValue );
		$('div#'+id).text( $('div#'+id).text() +', '+ varValue );
		$('input#'+id).val( varValue );
		$('input#'+id).attr("currentvalue", varValue );
	} catch (e) {}
}

function translateDeviceError( errType ) {
	
	if ( errType == -16 ) return 'I2C request error (less bytes returned than expected)';
	if ( errType == -15 ) return 'I2C end transmit error';
	if ( errType == -14 ) return 'I2C buffer length error';
	if ( errType == -13 ) return 'I2C read error';
	if ( errType == -12 ) return 'Chint read error';
	if ( errType == -11 ) return 'Chint eTotal not found';
	if ( errType == -10 ) return 'I2C checksum issue';
	
	if ( errType == -3 ) return 'CV temp read error';
	if ( errType == -4 ) return 'Aanvoer temp read error';
	if ( errType == -5 ) return 'Boiler temp read error';
	if ( errType == -6 ) return 'Chint structure error';
	if ( errType == -7 ) return 'Chint request error';
	if ( errType == -8 ) return 'Buiten temp read error';
	if ( errType == -2 ) return 'Home net command not found';
	if ( errType == -1 ) return 'Home net SET command not found';

/* i2c  RetCode
	-51:data too long to fit in transmit buffer
    -52:received NACK on transmit of address
    -53:received NACK on transmit of data
    -54:other error
	*/
}









 

