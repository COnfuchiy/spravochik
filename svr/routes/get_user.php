<?php
require '../srv_data/db_model.php';
$current_user = new Sprav_model();
echo json_encode($current_user->get_user($_GET['id']));