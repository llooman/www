<?php


	$fp = stream_socket_client("tcp://localhost:9000", $errno, $errstr, 30);
	if (!$fp) 
	{

		echo "stream_socket_client: $errstr ($errno)<br />\n";
		
	}
    else
    { 
		fwrite($fp, $_SERVER['REQUEST_URI'] . "\n" );
		
		while (!@feof($fp))
		{
			echo fgets($fp, 1024);
		}
		
		fclose($fp);
    }

/*
PHP Warning:  fgets() expects parameter 1 to be resource, boolean given in /var/www/home/scripts/socketGetMsg.php on line 13
PHP Warning:  feof() expects parameter 1 to be resource, boolean given in /var/www/home/scripts/socketGetMsg.php on line 11	
*/
	
	
?>