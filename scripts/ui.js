
var menuItemClicked = null;
var menuClickCount = 0;				// count clicks to support auto collapse menu when click outside the menu (onclick on body)

function toggleMenu( elem )
{
	hideMenu( );
	elem.toggle();	
	menuItemClicked = elem;
}

function hideMenu ( ) 
{	
	if ( menuItemClicked == null ) return;
	
	menuClickCount++;
	if ( menuClickCount < 2) return;		// compensate the click event on body level. (needed for auto collapse menu when click outside the menu)
	
	menuItemClicked.toggle();
	menuItemClicked = null;
	menuClickCount = 0;
}



	function showPage(pageName){
		var pageHtml = phpGetAjaxJSONData('scripts/getHtml.php',"cmd="+pageName);
		$("div#dashboard").html(pageHtml);
	}


	function busyCursor() {
		$("body").css("cursor", "progress");
		window.setTimeout(defaultCursor,500);
	}

	function defaultCursor() {
		$("body").css("cursor", "default");
	}
  

	function getCheckCookie( inputId ) 
	{
		var cookieVal = ( getCookie( inputId ) == 'true' );
		if ( cookieVal )
		{
			$('input#' + inputId).attr('checked', true);
			//enableAutoRefresh();
		}
		//alert('getCheckCookie='+inputId+" == "+cookieVal );
	}
	function setCheckCookie( inputId ) 
	{
		//log( "setCheckCookie  inputId=" +inputId+ ", checked="+$('#'+inputId ).is(':checked'));
		var newVal = $('#'+inputId ).is(':checked') ? true : false;
		setCookie( inputId, newVal, 7 );
		//alert('setCheckCookie='+inputId+" to "+newVal );
		
		//if( inputId == 'cv' && newVal  ) { $('input#cv2').attr('checked', false);setCookie( "cv2", false, 7 ); }
		//if( inputId == 'cv2' && newVal ) { $('input#cv').attr('checked', false);setCookie( "cv", false, 7 ); }
		///if( inputId == 'boiler' && newVal  ) { $('input#boiler2').attr('checked', false);setCookie( "boiler2", false, 7 ); }
		//if( inputId == 'boiler2' && newVal ) { $('input#boiler').attr('checked', false);setCookie( "boiler", false, 7 ); }
		//if( inputId == 'gas' && newVal  ) { $('input#gas2').attr('checked', false);setCookie( "gas2", false, 7 ); }
		//if( inputId == 'gas2' && newVal ) { $('input#gas').attr('checked', false);setCookie( "gas", false, 7 ); }

	}

	function loadDetails() // support calling from onClick with parameters
	{
		//alert('showDetails: html='+html+' node='+nodeId);		
		loadDashboard('options/'+html, event, nodeId);
	}
	function loadSensors()
	{
		loadDashboard('options/sensors.html', event, nodeId );
	}
	function showSensors()
	{
		loadDashboard('options/sensors.html', event, nodeId );
	}
	
	var htmls = new Array();

	function showDetails() // support calling from onClick with parameters
	{
		//alert('showDetails: html='+html+' node='+node);
		if(html)
		{			
			loadDashboard('options/'+html, event, nodeId);
			return;
		}	
		
		var optionHtml=null; 
		//alert('loadDashboard htmls.length='+htmls.length);
	 
		htmls.forEach( function (arrayItem)
		{
			//alert('loadDashboard arrayItem='+arrayItem.nodeId+' '+arrayItem.html);
			if(arrayItem.nodeId==nodeId) optionHtml=arrayItem.html;
		});
		if(optionHtml==null)
		{
			doJsonCmd("html", nodeId, newHtml);
			return;	
		}
		//alert('loadDashboard optionHtml='+optionHtml);
		loadDashboard('options/'+optionHtml+'.html', event, nodeId);
		//loadDashboard('options/'+nodeId2Options(nodeId)+'.html', event, nodeId);
	} 

	function newHtml(cmd, data)
	{
		htmls.push({nodeId:data.nodeId,html:data.html});
		
		loadDashboard('options/'+data.html+'.html', null, data.nodeId);
	}
	
	function loadDashboard( href2Load, event, parm )
	{

		//$( "div#pagebody" ).load( "PompOptions.htm",,fireInit(response,status,xhr) );
	//	if (window.console) console.log( 'dashboardHtml='+dashboardHtml );	
	//	if (window.console) console.log( 'parm='+parm );	
		
		
//		if ( event != null ) 
//		{			
//		  var menuClicked = event.target;
//
//		  if( menuClicked)
//		  {
//			  if(! menuClicked.nodeId) return;
//			  
//			 // alert('loadDashboard click '+  menuClicked.nodeId ); 
// 
//			  
//			  var ul = $(menuClicked.parentNode);  //.parentNode
// 
//			  if ( $(ul).css("opacity") != "1" ) 
//			  {
//				//alert("loadDashboard: dada");
//				  return;  
//			  }
//			  
//		  }
//		}

		hideMenu();
				
		$("div#dashboard").load(href2Load, function(responseTxt,statusTxt,xhr){
		    if(statusTxt=="success")
		    {	
			    //logg(1,"ui.loadDashboard: loaded "+href2Load);
		    	initDashboard(parm);
			    //logg(1,"ui.loadDashboard: executed initDashboard("+parm+")");		    	
		    }	
		    if(statusTxt=="error")
		    {
		      alert("Error loadDashboard: "+xhr.status+": "+xhr.statusText);
		    }
		  });	
		  
		 
 
	}	
