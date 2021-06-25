<?php
require '../srv_data/db_model.php';
$all_nodes = new Sprav_model();
echo json_encode($all_nodes->get_all_nodes($_GET['order_by']));