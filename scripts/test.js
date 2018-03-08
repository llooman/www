

	function checkDatetime( timestamp) {

		var utcDate = new Date(timestamp);
		var date = new Date();
		date.setUTCDate(utcDate.getDate());
		date.setUTCHours(utcDate.getHours());
		date.setUTCMonth(utcDate.getMonth());
		date.setUTCMinutes(utcDate.getMinutes());
		date.setUTCSeconds(utcDate.getSeconds());
		date.setUTCMilliseconds(utcDate.getMilliseconds());
	
		//var dt = new Date();
		//dt.setTime(_time_t);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
	
		alert('checkDatetime=' + date.getTimezoneOffset() );
	}
	
	
	/*
	 * 
	 * function handleMouseDown( evt, grafiek){
	 //console.log("handleMouseDown");
	 grafiek.isDragging = true;
	 grafiek.mouseXpos = evt.clientX;   	// remember for dragging
}

function handleMouseUp( evt, grafiek ){
	grafiek.isDragging = false;
    var deltaX = ( grafiek.mouseXpos  - evt.clientX ) / grafiek.canvas.width ;
	if (deltaX > 0.03 || deltaX < -0.03) {
		 
		grafiek.xDataStart = ( grafiek.xDataStart +  grafiek.xBereik * grafiek.xDataZoom * deltaX  );
		grafiek.refresh(); 
	} 
	else {
      myGrafiekClick( grafiek, evt );
	}
}
function handleMouseOut_OBS(e){
	if (window.console) console.log("handleMouseOut");   
}
function handleMouseMove( evt, grafiek ){
	grafiek.mouseMoveCnt++;
	if (grafiek.mouseMoveCnt > 100) {
		if  ( grafiek.isDragging == true ) {
		    
		    grafiek.mouseXpos = evt.clientX;
		    grafiek.refresh(); 
		}
		grafiek.mouseMoveCnt = 0;	  
	}
}  
function myGrafiekClick ( grafiek, evt) {

	var percX =   grafiek.getPercX(evt); 
	var percY =   grafiek.getPercY(evt);
	
	log("myGrafiekClick: percX="+percX + " percY="+percY  +" xBereik="+grafiek.xBereik );

	if (percY > .66 ) {
		// uitzoomen:  vervroegen start datum
		var xDelta = percX * grafiek.xBereik * grafiek.xDataZoom;
		grafiek.zoomOutX();  //  xZoom * 2 > xBereik = xBereik * 2;
		grafiek.xDataStart = ( grafiek.xDataStart - xDelta );
	}
	else if (percY < .3) {
		// inzoomen:  latere start datum
		var xDelta = percX * grafiek.xBereik * grafiek.xDataZoom / 2 ;  // zoom in on the click spot
		grafiek.zoomInX(); //  xZoom / 2 > xBereik = xBereik / 2
		grafiek.xDataStart = ( grafiek.xDataStart + xDelta );   
	}
	else {
		if (percX > .75) {
			
			grafiek.xDataStart = ( grafiek.xDataStart + ( grafiek.xBereik * grafiek.xDataZoom / 2 ) );
		}
		if (percX < .25) {
			
			grafiek.xDataStart = ( grafiek.xDataStart - ( grafiek.xBereik * grafiek.xDataZoom / 2 ) );
		}
	}

	grafiek.refresh();
}
	 * */
	
	
	

	/*	
	function myCallback ()
	{
	alert(this.responseText);
	}
	RGraph.AJAX('http://www.example.com/getdata.php', myCallback);

	// The toDataURL() is a standard canvas method. Assume that the myChart variable is your RGraph object.
	var image_data = myChart.canvas.toDataURL("image/png");
	$.post("save_chart.php", { src: image_data } );
	*/	
	/*
	$(window).resize(function(event) {

	var width = $(window).width();
	if (width < 960) {
	//if (event.button)
	alert('<960'+event.button);// Do Something
	}
	else {
		alert('>=960'+event.button);// Do Something
	//Do Something Else
	}
	}) ;   */

	/*		
	var bar = new RGraph.Bar('cnv1', data)
	.Set('chart.labels', labels )
	.Set('chart.gutter.left', 35) 					// ruimte voor labels
	.Set('chart.background.barcolor1', 'yellow')
	.Set('chart.background.barcolor2', 'green')
	.Set('chart.background.grid', true)
	.Set('chart.background.grid.dotted',true)    // ???
	.Set('chart.colors', ['blue','pink','brouwn' ])		
	.Draw();

	var thermometer = new RGraph.Thermometer('cnv1', 0,50,23)
	.Set('chart.labels', ['Graden celcius'] ) //  ??
	.Set('chart.scale.visible', true)
	.Set('chart.title.side','Aanvoer temp.')
	//.Set('chart.zoom.factor', 3)   // ??
	//.Set('chart.zoom.shadow',false)    // ??
	.Set('chart.shadow',false)
	//.Set('chart.gutter.left', 5)
	//.Set('chart.gutter.right', 5)

	.Set('chart.colors', ['rgba(255,0,0,1)'])

	// Now call the .Draw() method to draw the chart.
	.Draw();

	var gauge = new RGraph.Gauge('cnv1', 0, 100, 55)
	.Set('chart.title', 'Snelheid')
	.Draw();

	var line1 = new RGraph.Line('cnv1', data)
	    .Set('ymax', 1000)
	    .Set('hmargin', 5)
	    .Set('gutter.right', gutterRight)
	    .Set('gutter.left', gutterLeft)
	    .Set('gutter.top', gutterTop)
	    .Set('labels', labels)
	    .Set('tooltips', labels)
	    .Set('colors', ['red', 'green', 'blue'])
	    .Set('key', ['Flow rate', 'Speed', 'Pressure'])
	    .Set('key.position', 'gutter')
	    .Set('key.position.gutter.boxed', false)
	    .Set('key.position.x', 275)
	    .Set('noaxes', true)
//	    .Set('ylabels', false)
	    .Draw();

	*/