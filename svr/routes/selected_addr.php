<?php
require '../srv_data/db_model.php';
$addresses = new Sprav_model();
echo json_encode($addresses->get_addresses());