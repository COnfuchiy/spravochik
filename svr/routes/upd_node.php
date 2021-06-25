<?php
require '../srv_data/db_model.php';
$new_node = new Sprav_model();
echo json_encode($new_node->update_node($_GET['node_id'],$_GET['fullname'],$_GET['address'],$_GET['number']));