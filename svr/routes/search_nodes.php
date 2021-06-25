<?php
require '../srv_data/db_model.php';
$finding_nodes = new Sprav_model();
echo json_encode($finding_nodes->search_nodes($_GET['request']));