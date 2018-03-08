
<script type="text/javascript">

function initMe(){

	myGraph = new Graph('tempGraph');
	myGraph.refresh();
}
</script>

<?php

$cmd = $_POST['cmd'];


if ($cmd == "phpInfo")
{
	phpinfo(16);
}

if ($cmd == "grafiek")
{
 	echo "<figure><figcaption>grafiek</figcaption>";
 	echo "<canvas id=\"tempGraph\" width=\"500\" height=\"325\" style=\"border: 1px solid gray\">[No canvas support]</canvas>";
  	echo "</figure>";

}


?>