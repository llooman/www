function Grafiek( canvasId, initProc, drawProc, zoomActive ) 
{

	var me = this;				// using a var enables .refresh() from wihtin the object
	this.canvasId = canvasId;	// html canvas.id

	//var rawData;			
	//this.xRatio = 10;    	// pixel per value

	this.mouseXpos = 0;
	this.mouseMoveCnt = 0;
	this.isDragging = false;
	
	this.drawProc = drawProc;
	this.initProc = initProc;
	this.initialized = false;
	this.canvasWidth = null;
	this.canvasHeight = null;
	
	this.canvas = document.getElementById( canvasId );					// using getElementById enables .parentNode and getContext
	this.canvasElmnt = $( "#"+canvasId );								// using $ enables .click
	//this.canvasElmnt.click( function( event ) { me.refresh( event );});

	this.ctx = this.canvas.getContext('2d');
	
	this.xDataMin = 0;
	this.xDataMax = 100;
	this.xBereik = this.xDataMax - this.xDataMin;
	this.xDataZoom = 1;
	this.xDataBereik = this.xBereik * this.xDataZoom;
	
	this.xData2DateFactor = 1000;   // data in secondes Date in milliseconds

	this.xDataStart = 0;
	this.xDataEnd = this.xDataStart + this.xBereik;
	
	this.xPixelRatio = 96;
	this.xPadding  = 15;  	// pixel
	this.xZoom = 1;
	this.xMin = this.xDataMin;
	this.xMax = this.xDataMax;	
	
	this.yDataMin = 0;
	this.yDataMax = 100;
	this.yBereik = this.yDataMax - this.yDataMin;
	this.yDataZoom = 1;
	this.yDataStart = 0;
	this.yPixelRatio = 96;
	this.yPadding  = 15;
	this.yZoom = 1;
	this.yMin = this.yDataMin;
	this.yMax = this.yDataMax;	

	this.labelWidth = 1;
	this.labelStrokeStyle = '#ddd';
	this.labelFont = 'italic 8pt sans-serif';

	this.zoomActive = zoomActive;
	this.pixelRatio = 1;
	
	this.init();


};



Grafiek.prototype.setXWindow = function( xDataStart  ) 
{		
	
	this.xDataStart = xDataStart;	
	this.zoomX( );
	
};

Grafiek.prototype.zoomX = function( val) 
{
	if ( val != null ) {
		if ( val == 0 )  {
			this.xZoom = 1;
		}
		else if ( val > 0 ) 
		{
			this.xZoom = this.xZoom / 2;
		}
		else
		{
			this.xZoom = this.xZoom * 2;
		}
	}
	this.xBereik = ( this.xDataMax - this.xDataMin ) * this.xZoom ;
	this.xDataBereik = this.xBereik * this.xDataZoom;
	this.xDataEnd = this.xDataStart + this.xDataBereik;
	
	//alert( "drawLine xDataStart="+this.xDataStart+" xDataEnd="+ this.xDataEnd+" xZoom="+ this.xZoom + " xDataZoom="+this.xDataZoom );
	
};


Grafiek.prototype.init = function( refresh ) 
{						

	//alert('Grafiek.prototype.init');
	log( "Grafiek.js.init: "+this.canvasId );
	
	this.pixelRatio  = window.devicePixelRatio;  // window.devicePixelRatio = physical pixels / independent pixels (dips) 
	//log( "Grafiek.init: window.devicePixelRatio="+window.devicePixelRatio  );
	if ( this.pixelRatio == null || isNaN ( this.pixelRatio ) ) this.pixelRatio = 1;

	if ( this.canvasWidth == null || this.canvasWidth != this.canvas.width ) {
		this.xMax = Math.floor( ( 60 * this.canvas.width  ) / 480  ); // 60 min per 480 pixels  afgerond op int
		this.canvasWidth = this.canvas.width;
		//alert('Grafiek.init: width='+ this.canvasWidth);
	}

	if ( this.canvasHeight == null || this.canvasHeight != this.canvas.height ) {
		//this.xMax = Math.floor( ( 60 * this.canvas.width  ) / 480  ); // 60 min per 480 pixels
		this.canvasHeight = this.canvas.height;
		//alert('Grafiek.init: height='+ this.canvasHeight);
	}

	//log( "Grafiek.init: canvasWidth="+this.canvasWidth );
	//log( "Grafiek.init: canvasHeight="+this.canvasHeight );

	
	if (typeof this.initProc == "function")  
	{			 
    	this.initProc(this, refresh);
    	this.initialized = true;
	}

 
	//mvcSet('pixelRatio',pixelRatio); 
	////var xEenheden = Math.floor( ( 60 * grafiek.canvas.width / pixelRatio) / 480  ); // 60 min per 480 pixels	
	
	log( "Grafiek.js.init: finished "  );

};


Grafiek.prototype.refresh = function( xRealign, triggeredByUser, evnt ) 
{

    if (typeof this.drawProc == "function") {
    	//alert('Grafiek.prototype.refresh');
   	
    	var rect = this.canvas.getBoundingClientRect();
        var y = 0;
        var x = 0;

        if ( evnt != null) {
	        var xPixel = evnt.clientX - rect.left;
	        var yPixel = evnt.clientY - rect.top;
	        
	        if (xPixel < this.canvas.width / 3) x = -1;
	        if (xPixel > this.canvas.width * 2 / 3) x = 1;
	        
	        if (yPixel < this.canvas.height / 3) y = 1;
	        if (yPixel > this.canvas.height * 2 / 3) y = -1;
        }

        this.drawProc(this, xRealign, triggeredByUser, evnt, x, y);        
    }	
};


//                                   ( dataObj['data'], 48         , 1        , 'orange', 4  )
Grafiek.prototype.drawBars = function(dataArr, color, yDataFactor, xCount , width, xDataZoom ) 
{	
    yColumn = 1;
    if (color == null) color = "#f00";
    if (yDataFactor == null)  yDataFactor = this.yDataZoom;
    if (xDataZoom == null) xDataZoom = this.xDataZoom ;
    
    //log( "drawBars2  xDataStart="+this.xDataStart+" xDataZoom="+ this.xDataZoom+" xZoom=+ this.xZoom"  );
   
    if (dataArr == null) 
    {
    	alert ("drawBars: dataArr.length is null");
    	return;
    }       
 
    this.ctx.fillStyle = color;
    
    var xVal;
    var yVal;  
    var ySum=0;
    
    var xDelta=this.xBereik/xCount;
    var xMiddle=xDelta/2;
    var xMiddlePrev=xMiddle;
 
    
    for(var i = 0; i < dataArr.length; i ++)
    {
    	// calc x, y zero based   xDataStart is timestamp by init, x = FROM_UNIXTIME seconds after 1970 also set by init
    	xVal = ( ( dataArr[i][0] - this.xDataStart ) / xDataZoom );   
    	yVal = dataArr[i][yColumn];
    	
    	//log( "drawBars2  i="+xVal+" xVal="+xVal+" xStartValPrev="+xStartValPrev+" xDataZoom="+this.xDataZoom );
    	
    	if ( yVal != null && ! isNaN( yVal ) && xVal >= this.xMin )  
    	{  	    	  	
	    	
	    	xMiddle = xDelta/2 + (  xDelta * Math.trunc(xVal/xDelta) ) ;
	        //log( "drawBars2  xVal="+xVal+" xStartVal="+ xStartVal );
	        
	        if( xMiddlePrev < xMiddle  )  // skip pree xStart's
	        {
	        	this.paintBar(xMiddlePrev, ySum, yDataFactor, width);
		        
		    	if ( xVal > this.xMax )
		    	{
		    		ySum = 0;
		    		break;
		    	}

		        xMiddlePrev = xMiddle;
		    	ySum = yVal;		    	
	        }
	        else
	        {
	        	ySum = ySum + yVal;
	        }
    	}
    } 
    
    if(ySum > 0)
    {
    	this.paintBar(xMiddlePrev, ySum, yDataFactor, width);
    }
};


Grafiek.prototype.paintBar = function(xMiddle, ySum, yDataFactor, width)
{
	if(ySum < 1) return;
	
	var xPixel = this.xPadding + this.xPixelRatio * ( xMiddle - this.xMin  );  
	var yPixel = this.canvas.height - this.yPadding - this.yPixelRatio * ( ( ySum  / yDataFactor ) - this.yMin );
	var yHeight = this.canvas.height - this.yPadding - yPixel;

	this.ctx.fillRect ( xPixel - (width / 2) , yPixel , width, yHeight);	
};

 

Grafiek.prototype.drawBoolean = function(dataArr, color, yFalse, yTrue, xDataZoom ) 
{
    //if (xDataZoom != null) this.xDataZoom = xDataZoom  ;
    if (xDataZoom == null) xDataZoom = this.xDataZoom ;
    
    yColumn = 1;
    if (color == null) color = "#f00";
    
    log( "drawBoolean  xDataStart="+this.xDataStart+" xDataZoom="+ xDataZoom+" color="+ color+" canvasId="+this.canvasId);
    
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    
    this.ctx.beginPath();

    if (dataArr == null) 
    {
    	alert ("drawBoolean: dataArr.length is null");
    	return;
    }
    
	var plotStarted = false;
    var xPrev = null;
    var yPrev;
    var xVal;
    var yVal;
    var cnt = 0;
    
    for(var i = 0; i < dataArr.length; i ++) {
    	
    	xVal = ( ( dataArr[i][0] - this.xDataStart ) /  xDataZoom );   
    	
    	if (  dataArr[i][yColumn] != null && ! isNaN(dataArr[i][yColumn]) )  {
    		
    		if ( dataArr[i][yColumn] > 0 )
    			yVal = yTrue;
    		else
    			yVal = yFalse;
    		//log( "drawBoolean  xVal="+xVal+" yVal="+ yVal  );
    			
			if ( xVal > 0 && cnt > 0 && !plotStarted ) {
				// extrapolate start 
				plotStarted = this.lineTo ( 0, yPrev, true );
			}
		
			plotStarted = this.lineTo ( xVal, yPrev, !plotStarted );
			plotStarted = this.lineTo ( xVal, yVal, !plotStarted );

	    	if ( xVal > this.xMax   ) {
		    	// extrapolate stop	    		
				//log( "extrapolate  yVal4xMax="+yVal4xMax+" deltaX1="+deltaX1+" deltaX2="+deltaX2 );
				plotStarted = this.lineTo ( this.xMax, yPrev, plotStarted );
				
				break;
	    	}
	    	
	        cnt++;
	    	xPrev = xVal;
	    	yPrev = yVal;
    	}
    }
     
    this.ctx.stroke();
 
};


Grafiek.prototype.drawLine = function(dataArr , color,  yDataFactor, yDataStart, yOffset, xDataStart, xDataZoom) 
{	
    if (xDataStart == null)  xDataStart  = this.xDataStart;
    if (xDataZoom == null)   xDataZoom   = this.xDataZoom;
    if (yDataStart == null)  yDataStart  = this.yDataStart;
    if (yDataFactor == null) yDataFactor = this.yDataZoom;
    yColumn = 1;
    if (color == null)       color       = "#f00";
    if (yOffset == null)     yOffset     = 0;
        
    log("drawLine xDataStart="+this.xDataStart+" xDataZoom="+ xDataZoom+" color="+color+" canvasId="+this.canvasId);
    
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;    
    this.ctx.beginPath();
    
    if (dataArr == null) 
    {
    	alert ("Grafiek.drawLine: dataArr.length is null");
    	return;
    }
    
	var plotStarted = false;
    var xPrev = null;
    var yPrev;
    var xVal;
    var yVal;
    var cnt = 0;
    
    for(var i = 0; i < dataArr.length; i ++) {
    	
        xVal = ( ( dataArr[i][0] - xDataStart ) / xDataZoom );// + this.xMin ; 
    	
    	if (  dataArr[i][yColumn] != null && ! isNaN(dataArr[i][yColumn]) )  {
    		
    		//log( "drawArray3 xVal="+xVal+" yVal="+ this.yDataStart  );
    		yVal = ( ( dataArr[i][yColumn] - yDataStart ) * yDataFactor ) + yOffset;  // + this.yMin ; 
    		
			if ( xVal > 0 && cnt > 0 && !plotStarted ) {
				// extrapolate start 
				var deltaX1 = this.xMin - xPrev;
   				var deltaX2 = xVal - this.xMin;
				var xTot = deltaX1 + deltaX2;
				var deltaY = yVal - yPrev;
				var yVal4x0 = yPrev + deltaY * deltaX1 / xTot;
				//log( "extrapolate  yVal4x0="+yVal4x0+" deltaX1="+deltaX1+" deltaX2="+deltaX2 );
				plotStarted = this.lineTo ( 0, yVal4x0, true );
			}
		
			plotStarted = this.lineTo ( xVal, yVal, !plotStarted );

	    	if ( xVal > this.xMax   ) {
		    	// extrapolate stop	    		
				var deltaX1 = this.xMax - xPrev;
   				var deltaX2 = xVal - this.xMax;
				var xTot = deltaX1 + deltaX2;
				var deltaY = yVal - yPrev;
				var yVal4xMax = yPrev + deltaY * deltaX1 / xTot;
				//log( "extrapolate  yVal4xMax="+yVal4xMax+" deltaX1="+deltaX1+" deltaX2="+deltaX2 );
				plotStarted = this.lineTo ( this.xMax, yVal4xMax, plotStarted );
				
				break;
	    	}
	    	
	        cnt++;
	    	xPrev = xVal;
	    	yPrev = yVal;
    	}
    }
    //console.log("drawArray cnt="+cnt); y < this.yMin ? this.yMin : y )
    this.ctx.stroke();
    return;
    
    //Draw the dots
    this.ctx.fillStyle = '#333';
    for(var i = 0; i < dataArr.length; i ++) {

    	x = (dataArr[i][0] - this.xDataOffset ) / this.xDataFactor ;
    	if (x >= this.xMin  &&  x <= this.xMax ) {
	    	y = ( dataArr[i][yColumn] / this.yDataFactor  );
	    	this.ctx.beginPath();
	    	this.ctx.arc( this.getXPixel(x), this.getYPixel(y), 1, 0, Math.PI *2 , true);
	    	this.ctx.fill();
    	}
    }
};


Grafiek.prototype.drawCurve = function(dataArr, yColumn, color, xDataStart, xDataZoom, yDataStart,  yDataZoom ) {
	
    if (xDataStart == null) xDataStart = this.xDataStart;
    if (xDataZoom == null) xDataZoom = this.xDataZoom;
    if (yDataStart == null) yDataStart = this.yDataStart;
    if (yDataZoom == null) yDataZoom = this.yDataZoom;
    if (yColumn == null) yColumn = 1;
    if (color == null) color = "#f00";
    
    //log( "drawLine xDataStart="+xDataStart+" xDataZoom="+ xDataZoom+" xZoom="+ this.xZoom  );
    
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    
    this.ctx.beginPath();

    if (dataArr == null) {
    	alert ("Grafiek.drawLine: dataArr.length is null");
    	return;
    }
    
	var plotStarted = false;
    var xPrev2 = null;
    var yPrev2;
    var xPrev = null;
    var yPrev;
    var xVal;
    var yVal;
    var cnt = 0;
    
    for(var i = 0; i < dataArr.length; i ++) {
    	
        xVal = ( ( dataArr[i][0] - xDataStart ) / xDataZoom );// + this.xMin ; 
    	
    	if (  dataArr[i][yColumn] != null && ! isNaN(dataArr[i][yColumn]) )  {
    		
    		//log( "drawArray3 xVal="+xVal+" yVal="+ this.yDataStart  );
    		yVal = ( dataArr[i][yColumn] - yDataStart )  / yDataZoom ;  // + this.yMin ; 
    		
			if ( xVal > 0 && cnt > 0 && !plotStarted ) {
				// extrapolate start 
				var deltaX1 = this.xMin - xPrev;
   				var deltaX2 = xVal - this.xMin;
				var xTot = deltaX1 + deltaX2;
				var deltaY = yVal - yPrev;
				var yVal4x0 = yPrev + deltaY * deltaX1 / xTot;
				//log( "extrapolate  yVal4x0="+yVal4x0+" deltaX1="+deltaX1+" deltaX2="+deltaX2 );
				plotStarted = this.curve ( 0, yVal4x0, true, xPrev, yPrev, xPrev2, yPrev2 );
			}
		
			plotStarted = this.curve ( xVal, yVal, !plotStarted, xPrev, yPrev, xPrev2, yPrev2 );

	    	if ( xVal > this.xMax   ) {
		    	// extrapolate stop	    		
				var deltaX1 = this.xMax - xPrev;
   				var deltaX2 = xVal - this.xMax;
				var xTot = deltaX1 + deltaX2;
				var deltaY = yVal - yPrev;
				var yVal4xMax = yPrev + deltaY * deltaX1 / xTot;
				//log( "extrapolate  yVal4xMax="+yVal4xMax+" deltaX1="+deltaX1+" deltaX2="+deltaX2 );
				plotStarted = this.curve ( this.xMax, yVal4xMax, plotStarted, xPrev, yPrev, xPrev2, yPrev2 );
				
				break;
	    	}
	    	
	        cnt++;
	        xPrev2 = xPrev;
	        yPrev2 = yPrev;
	    	xPrev = xVal;
	    	yPrev = yVal;
    	}
    }
    //console.log("drawArray cnt="+cnt); y < this.yMin ? this.yMin : y )
    this.ctx.stroke();
};

Grafiek.prototype.curve = function( xVal, yVal, move, xPrev, yPrev, xPrev2, yPrev2 ) {
	
	if ( xVal < this.xMin ||  xVal > this.xMax ) return false;
	if ( yVal < this.yMin ||  yVal > this.yMax ) return false;

	if ( move != null && move == true )  {

		var xPixel = this.xPadding + this.xPixelRatio * ( xVal - this.xMin  );  //this.xPixelRatio * ( xVal - this.xMin );
		var yPixel = this.canvas.height - this.yPadding - this.yPixelRatio * ( yVal - this.yMin );

		this.ctx.moveTo( xPixel, yPixel );
		//log( "moveTo xVal="+xVal+" yVal="+yVal );
		return true;
	}

	if ( xPrev2 == null ) return true;
	
	var deltaY1 = ( yPrev - yPrev2 ) / ( xPrev - xPrev2 );
	var deltaY2 = ( yVal - yPrev ) / ( xVal - xPrev );
	
	if ( deltaY1 == deltaY1 ) {

		// straight line 
		var xPixel = this.xPadding + this.xPixelRatio * ( xPrev - this.xMin  );  //this.xPixelRatio * ( xVal - this.xMin );
		var yPixel = this.canvas.height - this.yPadding - this.yPixelRatio * ( yPrev - this.yMin );
		
		this.ctx.lineTo( xPixel, yPixel );	
		return true;
	}

	
	//calc curve 
	
 
	return true;

};

//ctx.quadraticCurveTo(250, 100, 400, 250);
//ctx.bezierCurveTo(150, 100, 350, 100, 400, 250);

Grafiek.prototype.lineTo = function( xVal, yVal, move ) {
	
	
	if ( xVal < this.xMin ||  xVal > this.xMax ) return false;
	if ( yVal < this.yMin ||  yVal > this.yMax ) return false;


	var xPixel = this.xPadding + this.xPixelRatio * ( xVal - this.xMin  );  //this.xPixelRatio * ( xVal - this.xMin );
	var yPixel = this.canvas.height - this.yPadding - this.yPixelRatio * ( yVal - this.yMin );

	if ( move != null && move == true )  {
		this.ctx.moveTo( xPixel, yPixel );
		//log( "moveTo xVal="+xVal+" yVal="+yVal );
	}  else  {
		this.ctx.lineTo( xPixel, yPixel );
		//log( "lineTo xVal="+xVal+" yVal="+yVal );
	}
	return true;

};

Grafiek.prototype.drawText = function( xPixel, yPixel, text ) {
	
	//log( "drawText xPixel="+xPixel+" yPixel="+yPixel+" text="+text );

	this.ctx.fillText( text, xPixel, yPixel );
 	
};

Grafiek.prototype.initCanvas = function( verticalGrid, horizontalGrid ) {
	
	//alert('Grafiek.prototype.init');
	
	this.canvas.width = this.canvas.width;		// reset canvas

	this.xBereik = ( this.xDataMax - this.xDataMin ) * this.xZoom ;
	//xBereik = this.xBereik  ;
	//xCenter = ( this.xDataMin + this.xDataMax ) / 2;
	//this.xMin = xCenter - ( xBereik  / 2 );
	//this.xMax = xCenter + ( xBereik  / 2 );	
	this.xMin = this.xDataMin;
	this.xMax = this.xMin + this.xBereik ;	

	this.yBereik = ( this.yDataMax - this.yDataMin ) * this.yZoom ;
	//yCenter = ( this.yDataMin + this.yDataMax ) / 2;
	//this.yMin = yCenter - ( this.yBereik  / 2 );
	//this.yMax = yCenter + ( this.yBereik  / 2 );	
	this.yMin = this.yDataMin;
	this.yMax = this.yMin + this.yBereik;	

	//- ( periode * grafiek.xZoom ) * (percX) / 2 
	
    this.xPixelRatio = ( this.canvas.width - this.xPadding ) / this.xBereik; 	//( this.xDataMax - this.xDataMin);
    this.yPixelRatio = ( this.canvas.height - this.yPadding ) / this.yBereik; 	//( this.yDataMax - this.yDataMin);

    //log( "initCanvas xBereik="+this.xBereik+" xMin="+ this.xMin+" xMax="+ this.xMax +" xPixelRatio="+ this.xPixelRatio );
    //log( "initCanvas yBereik="+this.yBereik+" yMin="+ this.yMin+" yMax="+ this.yMax +" yPixelRatio="+ this.yPixelRatio );

    
    this.ctx.lineWidth = 1;

    // Draw  y and x as
    this.ctx.strokeStyle = '#888';
    this.ctx.beginPath();
    this.lineTo ( this.xMin, this.yDataMax, true );
    this.lineTo ( this.xMin, this.yDataMin  );
    this.lineTo ( this.xMax, this.yDataMin  );
    this.ctx.stroke();
    
    //return;  // skip grid for testing
    
    if (verticalGrid != null) {
    	this.ctx.strokeStyle = '#ddd';
	    for(var xVal = this.xMin
	    	  ; xVal < this.xMax
	    	  ; xVal += verticalGrid * this.xZoom ) {  //* this.xZoom
	        if ( xVal > this.xMin ) {
	        	this.ctx.beginPath();
	            this.lineTo ( xVal, this.yDataMax, true );
	            this.lineTo ( xVal, this.yDataMin  );
	        	this.ctx.stroke();
	        }
	    }
    }   
    
    if (horizontalGrid != null) {
    	this.ctx.strokeStyle = '#ddd';
	    for(var yVal = this.yDataMin
	    	  ; yVal < this.yDataMax 
	    	  ; yVal += horizontalGrid * this.yZoom ) {
	    	
	        if ( yVal > this.yDataMin ) {
	        	this.ctx.beginPath();
	            this.lineTo ( this.xMax, yVal, true );
	            this.lineTo ( this.xMin, yVal   );
	        	this.ctx.stroke();
	        }
	    }
    }
};

function formatTimeLabel( xVal, grafiek, xData2DateFactor ) {
	//alert('getTimeLabel xVal=' +  xVal);

	var tijd = new Date(xVal*xData2DateFactor);
	var uur =  tijd.getHours(); //Math.floor ( xVal / 60 )   ;
	var minuut = tijd.getMinutes();
	var leadingZero = "";
	if ( minuut < 10)
		leadingZero = "0";

    //log( "getTimeLabel xVal="+xVal+" uur="+ uur+" minuut="+ minuut   );
	return uur.toString() + ":" + leadingZero + minuut.toString();
}

Grafiek.prototype.drawXas = function( from, step, proc, procParm ) {

	this.ctx.lineWidth = this.labelWidth;
	this.ctx.strokeStyle = this.labelStrokeStyle;
	this.ctx.font = this.labelFont;
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "top";
	
    //log( "drawXas xBereik="+this.xBereik+" xMin="+ this.xMin+" xMax="+ this.xMax +" xPixelRatio="+ this.xPixelRatio );

    var yPixel = this.canvas.height - this.yPadding * 3/4;
    for(var x  = ( from * step )  
          ; x < this.xBereik
          ; x  += step * this.xZoom )   //* this.xZoom
    {      
    	var xVal = this.xDataStart +  ( x + this.xMin ) * this.xDataZoom ;
   		var text = xVal ;
       	if (proc != null) 
       		text = proc( xVal, this, procParm );
       	var xPixel = this.xPadding + this.xPixelRatio * ( x );
       	this.drawText ( xPixel, yPixel, text );
       	this.ctx.stroke();
    }
};
Grafiek.prototype.drawYas = function( from, step, proc ) {

	this.ctx.lineWidth = this.labelWidth;
	this.ctx.strokeStyle = this.labelStrokeStyle;
	this.ctx.font = this.labelFont;
	this.ctx.textAlign = "right";
	this.ctx.textBaseline = "middle";
	
    //log( "drawYas yBereik="+this.yBereik+" yMin="+ this.yMin+" yMax="+ this.yMax +" yDataStart="+ this.yDataStart );
   
	var xPixel =  this.xPadding * 3/4;
    for(var y =  ( from * step )  
		  ; y < this.yMax
		  ; y += step * this.yZoom) 
    {
    	//var yVal = (this.yMin + y ) * this.yDataZoom + this.yDataStart ;
    	var yVal = ( ( y + this.yMin) * this.yDataZoom * this.yZoom ) + this.yDataStart ;
    	var text = yVal;
		if (proc != null) 
			text = proc( yVal, this );
		var yPixel = this.canvas.height - this.yPadding - this.yPixelRatio * ( y );
		 
		this.drawText ( xPixel, yPixel, text );
		this.ctx.stroke();
    }	
};


Grafiek.prototype.caption = function( caption ) { 
	$(this.canvas.parentNode).find('figcaption').text(caption)  ;
};

Grafiek.prototype.setWidth = function( newWidth ) { 
	//alert('setWidth ' + this.canvasElmnt.offset().left  + ' '+ newWidth );
	this.canvas.width  = newWidth - this.canvasElmnt.offset().left * 2 ;
};



Grafiek.prototype.getXPerc = function(evt) {
	var rect = this.canvas.getBoundingClientRect();
    var xPixel =  evt.clientX - rect.left;
    if (xPixel <= this.xPadding)
    	return (0);
    var ret = (xPixel - this.xPadding) / (this.canvas.width - this.xPadding);
    return ret;
    return  Math.round( ret * 10 ) / 10;
};
Grafiek.prototype.getYPerc = function(evt) {
	var rect = this.canvas.getBoundingClientRect();
    var yPixel = evt.clientY - rect.top;
    if (yPixel >= ( this.canvas.height - this.yPadding) )
    	return (0);
    var ret = 1 -   ( yPixel ) / ( this.canvas.height - this.yPadding );
    return ret;
    //return Math.round( ret * 10 ) / 10;
};


Grafiek.prototype.calcMaxY = function(dataArr, yDataFactor) {
	var MaxY = 0; 
	for(var i = 0; i < dataArr.length; i ++) {
		if ( dataArr[i][1] > MaxY)
			MaxY = dataArr[i][1];
	}
    return MaxY / yDataFactor ;
};

Grafiek.prototype.drawList_OBS = function(data) {
	
	//alert ('this.xMax='+this.xMax);
    var ctx = this.canvas.getContext('2d');            
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#f00';
    
    //alert("data.values.length="+data.values.length);
    // Draw the line graph
    ctx.beginPath();
    ctx.moveTo( this.getXPixel(data.values[0].X), this.getYPixel(data.values[0].Y));
    for(var i = 1; i < data.values.length; i ++) {
    	  
        ctx.lineTo( this.getXPixel(data.values[i].X), this.getYPixel(data.values[i].Y));
    }
    ctx.stroke();
    
    // Draw the dots
    ctx.fillStyle = '#333';
    for(var i = 0; i < data.values.length; i ++) {  
        ctx.beginPath();
        ctx.arc( this.getXPixel(data.values[i].X), this.getYPixel(data.values[i].Y), 1, 0, Math.PI *2 , true);
        ctx.fill();
    } 
	
	
};

Grafiek.prototype.mouseDown = function( evt, grafiek ) {	

	this.isDragging = true;
	this.mouseXpos = evt.clientX;   	// remember for dragging
}; 

Grafiek.prototype.mouseUp = function( evt ) 
{	
	
	this.isDragging = false;
    var deltaX = ( this.mouseXpos  - evt.clientX ) / this.canvas.width ;
	if (deltaX > 0.03 || deltaX < -0.03) 
	{	
		log("mouseUp: refresh" );
		this.setXWindow( this.xDataStart +  this.xDataBereik * deltaX  );
		this.refresh(); 
	} 
	else 
	{
		log("mouseUp: click" );
		this.click( evt );
	}
}; 

Grafiek.prototype.mouseMove = function( evt ) 
{	

	this.mouseMoveCnt++;
	if (this.mouseMoveCnt > 100) {
		if  ( this.isDragging == true ) 
		{
		    
			this.mouseXpos = evt.clientX;
			this.refresh(); 
		}
		this.mouseMoveCnt = 0;	  
	}
};  

Grafiek.prototype.click = function( evt ) 
{	
	grafiek = this;
//function click( evt, grafiek ) {	

	var xPerc =   grafiek.getXPerc(evt); 
	var yPerc =   grafiek.getYPerc(evt);
	
	log("myGrafiekClick: xPerc="+xPerc + " yPerc="+yPerc  +" xBereik="+grafiek.xBereik );

	if ( yPerc <= 0  && xPerc <= 0 )  {
		
		grafiek.refresh( true );   // realign x 
		return;
		
	}
	
	if (yPerc > .75 ) 
	{
		// uitzoomen:  vervroegen start datum
		var xDelta = xPerc * grafiek.xDataBereik;
		//grafiek.zoomOutX();  //  xZoom * 2 > xBereik = xBereik * 2;
		grafiek.zoomX( -1 );  //  xZoom * 2 > xBereik = xBereik * 2;
		grafiek.setXWindow ( grafiek.xDataStart - xDelta );
	}
	else if (yPerc < .25) 
	{
		// inzoomen:  latere start datum
		var xDelta = xPerc * grafiek.xDataBereik / 2 ;  // zoom in on the click spot
		//grafiek.zoomInX(); //  xZoom / 2 > xBereik = xBereik / 2
		grafiek.zoomX( 1 ); //  xZoom / 2 > xBereik = xBereik / 2
		grafiek.setXWindow ( grafiek.xDataStart + xDelta );   
	}
	else 
	{

		if ( xPerc > .80 ) {
			
			grafiek.setXWindow ( grafiek.xDataStart + ( grafiek.xDataBereik / 2 ) );
		}
		else if ( xPerc < .20 ) {
			
			grafiek.setXWindow ( grafiek.xDataStart - ( grafiek.xDataBereik  / 2 ) );
			 
		}
		else  
		{			
			grafiek.refresh( false, true );
			return;
		}
	
	}
 
	grafiek.refresh();
}; 