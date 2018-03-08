 

var logging = false;
var debug=0;

var showWindowAlert = false; // ??
var refreshError = false;
var logAlert = false;

var drawGrafiekActive = false;
var refreshActive = false;

var myResize = true;  	// enabled resize

var myGrafiek = null;	// grafiek op het start scherm

var startDate = null;
var stopDate = null;

var display = 1;

var monthNames = [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

var graphLines = new Array(0);

/* 

var myrefresh;

function refresh(delay)
{
	if(delay==null)delay=100;
	myrefresh = setTimeout(function(){refreshData();clearTimeout(myrefresh);}, delay);
}

*/
function logg(lvl, text)
{
	if(lvl>=debug && window.console)
	console.log( lvl+': '+ text);
}



function setParm(id, delta)				{setParm2(nodeName, id, delta);				refresh();}
function setChkParm(id)					{setChkParm2(nodeName, id);					refresh();}
function sendParm(id, newValue, delay)	{sendParm2(nodeName, id, newValue, delay);	refresh(delay);}


    
$(document).ready( function(){

	//mvcSet('test',10); 
	//showWindowAlert = true;
	/*
	jQuery('#iotHome').on('swipeleft', function(e) {
		  alert('swipeleft home');
		});
	
	jQuery('#iotHome').on('swiperight', function(e) {
		  alert('swiperight home ');
	});*/
	
	
	var query = window.location.search.substring(1);	
	if ( query.slice( 0, 5 ) == 'ketel' ) { loadDashboard('KetelOptions.php'); return; }
	if ( query.slice( 0, 4 ) == 'pomp' )  { loadDashboard('PompOptions.php'); return; }
	

	if( window.location.port == 3000 )
	{
		refreshData( false );	
	}
	else
	{
		refreshData( false );	
	}
	
	
	//alert('canvas = ' + $('canvas#tempGraph').length );
	//if ( $('canvas#tempGraph').length > 0 ) 
	
	if ( $('canvas#tempGraph').is(":visible") )  
	{
		myGrafiek = new Grafiek( "tempGraph", initMyGrafiek, drawMyGrafiek, true );
		mvcSet2( 'test', myGrafiek.pixelRatio );
	}
	
/*	
	$('#schakelaar').click(function(e){
		var schak = $('#'+this.id);
		if ( schak.hasClass('on'))	
			schak.removeClass('on');
		else
			schak.addClass('on');
	});
	*/

	$('ul.mainmenu li').click(function() {
		toggleMenu ( $( this, event ).children('ul') ) ;
    });	
	
	
	$('label').click(function(){
		$(this).children('span').addClass('input-checked');
		$(this).parent('.toggle').siblings('.toggle').children('label').children('span').removeClass('input-checked');
	});

	//console.log("$(document).ready klaar"); 

});






function initMyGrafiek( grafiek, refresh ) {
	
	log( "Pomp.js.initMyGrafiek: start" );	
	
	grafiek.setWidth( window.innerWidth ); // center in the window: padding right = padding left

	/*
	 * Set X-as 
	 * Data zoom = verhouding tussen de data waarden en de plot waarden bv 60 =  plot in minuten en data in secondes
	 * 
	 * Het bereik is  van 0 minuten tot 24 * 60 minuten = 1 dag
	 *  
	 */
	grafiek.xDataMin  = 0 * 60;
	
	var pixRatio = grafiek.pixelRatio < 3 ? 1 : 3;
	
	grafiek.xDataMax  = ( 24 * 60 ) / pixRatio; // grafiek.pixelRatio;	// 24 uur op pc 8 uur op phone
	grafiek.xDataZoom = 60;  			// in minuten:  60=1uur
	grafiek.xPadding  = 25;  			// linker kantlijn in pixel

	log( "Pomp.js>initMyGrafiek: pixelRatio="+grafiek.pixelRatio );
//	alert("pixelRatio="+grafiek.pixelRatio);

	grafiek.xData2DateFactor = 1000;    // factor to calc date from x-value

	grafiek.yDataMin  = 0;		        // 10 graden celcius
	grafiek.yDataMax  = 65;		        // 65 graden celcius
	grafiek.yDataZoom = 1;
	grafiek.yPadding  = 25;   	        // onderkantlijn in pixel	

	/*
	 * Bereken de start waarde van de data
	 */
	setStartDate( null, grafiek.pixelRatio ); // today default
	
	var xDataStartVal = Math.round(startDate.valueOf()/grafiek.xData2DateFactor);
	grafiek.setXWindow( xDataStartVal  );  // set start value of x data and calc the end based on xDataMin/Max/Zoom 

//	grafiek.xStart( startDate.valueOf()  );

	grafiek.zoomX( 0 );  // calc end
 	
	$(grafiek.canvasElmnt).unbind('mousedown'); // (function(evt){ grafiek.mouseDown( evt );});
	$(grafiek.canvasElmnt).mousedown(function(evt){ grafiek.mouseDown( evt );});
	$(grafiek.canvasElmnt).unbind('mousemove'); //(function(evt){ grafiek.mouseMove( evt );});
	$(grafiek.canvasElmnt).mousemove(function(evt){ grafiek.mouseMove( evt );});
	$(grafiek.canvasElmnt).unbind('mouseup'); //(function(evt){ grafiek.mouseUp( evt );});
	$(grafiek.canvasElmnt).mouseup(function(evt){ grafiek.mouseUp( evt );});


 	//$("#ardLog > tbody").empty();
	
	//graphLines = new Array(0); 
	
	getJsonData("graphs", function(cmd, data)
	{	
		if( data.retCode < 0)
		{
			mvcSet2('get graphs err: ', data.message);  
		}
		
		$.each( data.graphs, function(idx, line)  // TODO use line.factor  use drawBoolean
		{
			{
				var graphObject  = {"id" : line.id };
				var factor = line.factor || 1;
				var color = line.color || 'black';
				var txtColor = color;
				if(txtColor=='black') txtColor = 'white'
				var drawType = line.type || 1;
				var aan = line.aan || 60;
				var uit = line.uit || 50;
				graphLines.push(graphObject);
				graphObject.grafiek = grafiek;
				graphObject.name = line.name;
				 

				
				if($('#chk'+line.id).length ==0)
					$('#graphSettings').append('<div><label title="'+line.id+'" style="color:'+txtColor+'"><input type="checkbox" id="chk'+line.id+'" onclick="saveSettings();" />'+line.name+'</label></div>');

				getCheckCookie('chk'+line.id);
				
				//alert('chk'+line.id);
				
				if(drawType==1)
				{
					graphObject.simulate = simulateKetelData;
					graphObject.drawFunc = function( dataObj ){ dataObj.grafiek.drawLine( dataObj['data'], color, factor); } ;					
				}
				if(drawType==2)
				{
					graphObject.simulate = simulateKetelData;
					graphObject.drawFunc = function( dataObj ){ dataObj.grafiek.drawBoolean( dataObj['data'], color, uit, aan ); } ;					
				}
				if(drawType==3)
				{
					graphObject.simulate = simulatePompRetour2;
					graphObject.drawFunc = function( dataObj ){ dataObj.grafiek.drawBars( dataObj['data'], color, factor, 24, 4); } ;
				}
			}			
		}); 
		
		if(refresh== null || refresh== true)
		{
			grafiek.refresh( true, false );
		}
		
	});	
	
	getJsonData("graphPlans", function(cmd, data)
	{	
		if( data.retCode < 0)
		{
			mvcSet2('get graphPlans err: ', data.message);  
		}
		//{"graphPlans":[{"graphPlan":"Kantoor","ids":[2121,2123]},{"graphPlan":"Verw","ids":[313,320,620]}],"retCode":0,"message":""}
		
		$.each( data.graphPlans, function(idx, line)  // TODO use line.factor  use drawBoolean
		{
			//alert('graphPlan='+line.graphPlan);
			if($('#plan'+line.graphPlan).length==0)
				$('#graphPlans').append('<button type="button" id="plan'+line.graphPlan+'" onclick="showPlan(\''+line.graphPlan+'\');" >'+line.graphPlan+'</button>');
			 
		});
		
		if($('#totals').length==0)
			$('#graphPlans').append('&nbsp;<span id="totals">.</span>'); 
		
	});
	
	log( "Pomp.js.initMyGrafiek: finished" );
}

function showPlan(name)
{
	//alert('showPlan #'+name);
	
	mvcSet2("groupName", name);

	$.each(graphLines, function( index, line )
	{
		$('#chk'+line.id).prop('checked', false)		 			  
	});

	getJsonData("graphPlans", function(cmd, data)
	{	
		if( data.retCode < 0)
		{
			mvcSet2('get graphPlans err: ', data.message);  
		}
		//{"graphPlans":[{"graphPlan":"Kantoor","ids":[2121,2123]},{"graphPlan":"Verw","ids":[313,320,620]}],"retCode":0,"message":""}
		
		$.each( data.graphPlans, function(idx, line)  // TODO use line.factor  use drawBoolean
		{
			if(line.graphPlan==name)
			{
				$.each(line.ids, function(idx, id)
				{
					$('#chk'+id ).prop('checked', true)
				});		
			}
 			 
		});
		
		cmdRefreshGrafiek(false);	
	});	
	
	$('#planName').val(name);
}

function getGraphData(varId)
{
 
	for(i=0;i<graphLines.length;i++)
	{
		if(graphLines[i].id == varId)
		{
			return graphLines[i];		
		}
	}
}
 
 
function drawMyGrafiek( grafiek, xRealign, triggeredByUser, evt, x, y) {
	
	if( drawGrafiekActive ) return;
	drawGrafiekActive = true;
	
	log( "Pomp.js>drawMyGrafiek: start canvasId="+grafiek.canvasId  );
	  
	 
	if ( triggeredByUser ) refreshData( false );

	// calc Dates
	startDate = new Date( grafiek.xDataStart * grafiek.xData2DateFactor );
	startDate.setMilliseconds(0);
	startDate.setSeconds(0);
	if ( xRealign == true ) {
		startDate.setMinutes( 15 * ( startDate.getMinutes() % 15 ) );  // tonen per kwartier, niet handig i.v.m. verspringen bij in en uitzoomen
	}
	
	var xDataStartVal = Math.round(startDate.valueOf()/grafiek.xData2DateFactor);
	grafiek.setXWindow( xDataStartVal  );  // set start value of x data and calc the end based on xDataMin/Max/Zoom 
	
	stopDate = new Date( ( grafiek.xDataStart + ( grafiek.xBereik * grafiek.xDataZoom ) ) * grafiek.xData2DateFactor );
	if ( stopDate > new Date() ) stopDate = new Date();  	// prevent in the future
	
	//log( "Pomp.js>drawMyGrafiek: \nstart=" + startDate + " \nstop="+ stopDate);		
	
	var xLabel = 120; // x label elke 2 uur
	var yLabel = 10;  // y label elke 10 graden
	var xGrid = 60;  // elk uur 			  
	var yGrid = 5; 	 // elke 5 graden celius			 
	
	grafiek.initCanvas( xGrid, yGrid );     	// optional (xGrid , yGrid)
	grafiek.drawXas( 0, xLabel, formatTimeLabel, grafiek.xData2DateFactor );  	// start, step, callback for label text
	grafiek.drawYas( 1, yLabel );				// vanaf 10 elke 10
	
	$('span#graphCaption').text( startDate.getDate()+'-'+monthNames[startDate.getMonth()]+' '         
			+ ' van ' +  startDate.getHours()+':'+startDate.getMinutes()   
			+ ' tot ' +  stopDate.getHours()+':'+stopDate.getMinutes()   
			+ ' zoom=' + grafiek.xZoom );

	
//	grafiek.caption(startDate.getDate()+'-'+monthNames[startDate.getMonth()]+' '        //toDateString() 
//			+ ' van ' +  startDate.getHours()+':'+startDate.getMinutes() //startDate.toLocaleTimeString()  
//			+ ' tot ' +  stopDate.getHours()+':'+stopDate.getMinutes() //stopDate.toLocaleTimeString()  
//			+ ' zoom=' + grafiek.xZoom 
//			);
	
	//d.getMonth()] +' '+ d.getDate() +', '+d.getFullYear() +' '+d.getHours() +':'+d.getMinutes();

	try {  
		
		$( "#graphSettings" ).find('input').each(function( ) 
		{
			  //log( "Pomp.js>drawMyGrafiek: graphSettings"   );
			  var chkId = $( this ).attr('id');
			  
			  if(chkId.startsWith('chk'))
			  {
				  var graphId = chkId.substring(3);
				  if( $('#'+chkId).is(':checked') )
				  {
					  getDataAndDrawGraph( grafiek.xDataStart, grafiek.xDataEnd, getGraphData(graphId) );
				  }
			  }	   
		});
 
		$( "#graphSettings2" ).find('input').each(function( ) 
		{
			  //log( "Pomp.js>drawMyGrafiek: graphSettings2"   );
			  var chkId = $( this ).attr('id');
			  			  			 			  
			  if(chkId.startsWith('chk'))
			  {
				  var graphId = chkId.substring(3);
				  if( $('#'+chkId).is(':checked') )
				  {
					  getDataAndDrawGraph( grafiek.xDataStart, grafiek.xDataEnd, getGraphData(graphId) );
				  }
			  }	   
		});
 
	}
	catch (exp) 
	{
		alert ('drawMyGrafiek<Pomp.js>: exception=' + exp);
		return;
	}
	
 //totals&1511431200&1511517600
 //totals?1511391600&1511445600

	doJsonCmd("totals", grafiek.xDataStart+"&"+grafiek.xDataEnd, function(cmd, data)
	{	
		if( data.retCode < 0)
		{
			mvcSet2(cmd+' err: ', data.message);  
		}
		//{"graphPlans":[{"graphPlan":"Kantoor","ids":[2121,2123]},{"graphPlan":"Verw","ids":[313,320,620]}],"retCode":0,"message":""}
		
		var strTotals = '';
		$.each( data.totals, function(idx, line)  // TODO use line.factor  use drawBoolean
		{
			if( $('#chk'+line.id).is(':checked') )
			{
				if(strTotals!='') strTotals += ', ';
				strTotals += ( line.name + '=' + line.cost);			
			}			
		 
		});	
		
		$('span#totals').text( strTotals );
		//alert ('totals=' + strTotals);
		

	});	
	
 
	
	drawGrafiekActive = false;
	 
	log( "Pomp.js>drawMyGrafiek: finished "  );		 
}

function refreshData( async ){
 	
	//alert('start refreshData');
	
	if(refreshActive) return;
	refreshError = false;
	refreshActive = true;
	 
	try { showMvc('main', async ); } catch (err) {};

	refreshActive = false;
}	


function cmdRefreshGrafiek( init ) 
{		
	if ( myGrafiek == null ) return;
	if ( init == true )  {
		myGrafiek.init( false );
	}
	myGrafiek.xDataStart =  Math.round( startDate.valueOf()/myGrafiek.xData2DateFactor); //startDate.valueOf(); 
	myGrafiek.refresh(); // event

}
 
function setStartDate( dagen, ratio ){

	if ( ratio == null ) ratio = 1;
		
	// calc start hour 
	// on a phone the ratio = 3 > x-as van 8 uur 
	// on pc the ratio = 1 > x-as van 24 uur
	var hoursOnXas = 24 / ratio;
	var now = new Date();
	var currHour = now.getHours() -2 ;
	var startHour =  Math.floor ( currHour - ( currHour % hoursOnXas ) );
	
	if (dagen == null) {
		startDate =  new Date();
		//startDate.setSeconds(0);
		//startDate.setMilliseconds(0);
		startDate.setMinutes(0);
		startDate.setHours( startHour );
	}
	else 
	{		
		startDate =  new Date( startDate.valueOf() + hoursOnXas * 60 * 60000 * dagen);			 
	}
}


function sendRpi(  ){
	
    var parms = 'abcdefghijkz';
	
    doJsonCmd( "rpi", parms );  	

}

function thermostaatClick( thermostaatId ){
	
	//var aanzetten = $('#'+ thermostaatId).is(':checked') ;  // in the onclick we still have the previous value !!!
	
	//var parms = 'thermostaatAan&';  
	//parms +=   aanzetten ? "true" : "false"   ;
		
	//doJson2( "ketel", parms, true, simulateInfo, mvcKetel );	
	setParm2("ketel",'thermostaatAan');
}

	
$(window).on('resize', function(){
	if ( myResize != true)
		return;
	cmdRefreshGrafiek( true );
	
});

	 
