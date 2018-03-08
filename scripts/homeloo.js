/*  
*	homeloo.js
*	
*	transform a random meetpunten naar een lijn met vaste x waarden zodat Graph er een grafiek van kan printen.
*   omdat we graph niet meer gebruiken is dit niet meer nodig.
*
*/

function transformRawData2Points(rawData, start, stop, delta) {
	transformRawData2Points(rawData, start, stop, delta, null, null, null);
}
function transformRawData2Points(rawData, start, stop, delta, divider) {
	transformRawData2Points(rawData, start, stop, delta, divider, null, null);
}
function transformRawData2Points(rawData, start, stop, delta, divider, points) {
	transformRawData2Points(rawData, start, stop, delta, divider, points, null);
}
function transformRawData2Points(rawData, start, stop, delta, divider, points,
		labels) {
	// if(typeof divider === "undefined") {do somthing to init parameters }
	var rawPntr = 0;
	var newY;
	if (points == null) {
		points = new Array();
		// alert('transformRawData2Points set new points');
	}
	// alert('transformRawData2Points rawData='+start + ' stop' + stop + '
	// delta' + delta);
	for ( var x = start; x <= stop; x = x + delta) {
		// skip raw data before the x we are looking for
		while (rawPntr < rawData.length && rawData[rawPntr][0] < x)
			rawPntr++;

		alert('transformRawData2Points x=' + x + ' rawPntr=' + rawPntr
				+ '   data=' + rawData[rawPntr][0]);

		// calc y for
		if (rawPntr == 0) {
			// begin grafiek extrapoleren met eerste raw waarde
			newY = rawData[rawPntr][1];
			// points.push( rawData[rawPntr][1] );
			if (labels != null)
				labels.push(x);
		} else if (rawPntr >= rawData.length) {
			// einde grafiek extrapoleren met laatse raw waarde
			newY = rawData[rawData.length - 1][1];
			// points.push( rawData[rawData.length-1][1] );
			if (labels != null)
				labels.push(x);
		} else {
			if (rawData[rawPntr][0] == x) {
				// points.push( rawData[rawPntr][1] ); // rawData x exactly
				// matches the x of the point (preventing a divide by 0)
				newY = rawData[rawPntr][1];
			} else {
				// interpoleren calc y = rawY - ( deltaY * ( (rawX - x) / deltaX
				// ) )
				var rawX = rawData[rawPntr][0];
				var rawY = rawData[rawPntr][1];
				var newY = rawY
						- ((rawY - rawData[rawPntr - 1][1]) * ((rawX - x) / (rawX - rawData[rawPntr - 1][0])));
				// points.push( newY );
			}
			if (labels != null)
				labels.push(x);
		}

		if (divider != null && divider > 1)
			newY = newY / divider; // decimalen achter de comma
		// alert('transformRawData2Points');
		points.push(newY);
		// alert('transformRawData2Points points='+points );
	}
	return points;
}

function calcTimeLabels(start, stop, delta) {
	calcTimeLabels(start, stop, delta, null);
}
function calcTimeLabels(start, stop, delta, labels) {
	// alert('calcTimeLabels'+start + ' ' + stop);
	if (labels == null)
		labels = new Array();

	for ( var timestamp = start; timestamp <= stop; timestamp = timestamp
			+ delta) {
		// alert ('timestamp='+timestamp);
		var tmp = new Date();
		var localTime = new Date((timestamp));// - (tmp.getTimezoneOffset() *
		// 60000) );
		var timeLabel = "";
		if (localTime.getHours() < 10)
			timeLabel += "0";
		timeLabel += localTime.getHours() + ":";
		if (localTime.getMinutes() < 10)
			timeLabel += "0";
		timeLabel += localTime.getMinutes();

		// alert('localTime=' + localTime.toISOString());
		// alert('timeLabel=' + timeLabel);

		labels.push(timeLabel);
	}
	// alert('calcTimeLabels labels='+labels );
	return labels;
}


