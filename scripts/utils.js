/*  
*	llo domo utils.js
*
*/
function checkChanged(  checkId ) {
	
	var checkVal = $('#'+ checkId);
	
	
    if ( checkVal.is(':checked')  ) {
        alert("Checked!");
    } else {
        alert("UnChecked!");
    }
}

function dateFull( dat	) {

	var tmpDate = new Date(dat);
	var strDate = tmpDate.toISOString().slice(0, 19);
	return strDate.slice(0, 10) + " " +  strDate.slice(11 );
}
function dateShort( dat	) {
	
	if ( dat == null ) return "null";
	var tmpDate = new Date(dat);
	var localDate = new Date( tmpDate.getTime() - tmpDate.getTimezoneOffset()  * 60 * 1000);  
	var strDate = localDate.toISOString().slice(0, 19);
	return strDate.slice(5,10 ) + " " +  strDate.slice(11,16  );
}

function dateTimeShort( dat	) {
	
	if ( dat == null ) return "null";
	var tmpDate = new Date(dat);
	var localDate = new Date( tmpDate.getTime() - tmpDate.getTimezoneOffset()  * 60 * 1000);  
	var strDate = localDate.toISOString().slice(0, 19);
	return strDate.replace("T","  ");
}
function dateISO( dat	) {

	if ( dat == null ) return "null";
	var tmpDate = new Date(dat);
	var strDate = tmpDate.toISOString().slice(0, 19);
	return strDate.slice(0, 10)  ;
}
function dateShort2( dat	) {

	var strDate = Date(dat);
	return strDate; //.slice(4,16 );
}

//getTimezoneOffset()

function log( msg) {
	
	if ( logging == false ) return;
	if ( logAlert )
		alert( msg );
	else
		if (window.console) console.log( msg );
}

function getTimeLabelObs( msec) {
	//alert('getTimeLabel msecs=' +  msecs);
	var datum = new Date( msec );
	var leadingZero = "";
	if ( datum.getMinutes() < 10)
		leadingZero = "0";
	//return datum.getUTCHours() + ":" + leadingZero + datum.getUTCMinutes();
	return datum.getHours() + ":" + leadingZero + datum.getMinutes();
}






function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value)
			+ ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

function doNothing(){}

function refreshPage(){
	window.location = window.location;
	//location.reload(false); 
}
function enableAutoRefresh() {
	timeoutID = window.setTimeout( function(){refreshPage();} ,10000);
}

function  toggleAutoRefresh(){
	var autorefresh = $('input#autoRefresh').is(":checked");
	setCookie("autorefresh",autorefresh,90);
	if (autorefresh != 'true')  {
		window.clearTimeout(timeoutID);
		timeoutID = null;
		return false;
	}
	enableAutoRefresh();
    return true;
}


/*
var rect = canvas.getBoundingClientRect();
return {
  x: evt.clientX - rect.left,
  y: evt.clientY - rect.top
};
*/

function test(){
	
	$("#test").html("testtttttttt");
	alert('done');
}
function fireInit(response,status,xhr) {
	alert('fireInit status='+status);
}
function menuClick(ev) {
	alert('menuClick status=' );
}


function home(){
 alert('home');
}
function hellogoodbij(){
 alert('Hello Goodby');
}
 
