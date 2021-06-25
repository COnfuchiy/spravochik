<?php

abstract class Main_Model
{
    protected $_cur_db;

    function __construct($connected = false)
    {
        if ($connected)
            $this->_cur_db = $connected;
        else
            $this->_cur_db = new PDO('mysql:dbname=sprav;host=localhost', 'root', '',array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
    }

    function current_db()
    {
        return $this->_cur_db;
    }

    function __destruct()
    {
        $this->_cur_db = null;
    }
}

class Sprav_model extends Main_Model
{
    function get_all_nodes($order=1)
    {
        if ($order==1)
            $order = 'ORDER BY fullname';
        elseif ($order==2)
            $order = 'ORDER BY address';
        elseif ($order==3)
            $order = 'ORDER BY create_date DESC';
        else
            $order = 'ORDER BY create_date';
        return $this->current_db()->query("SELECT * FROM spravochnik ".$order)->fetchAll(PDO::FETCH_ASSOC);
    }

    function get_user($node_id){
        $new_query = $this->current_db()->prepare("SELECT * FROM spravochnik WHERE node_id = :node_id");
        $new_query->bindParam("node_id", $node_id, PDO::PARAM_INT);
        $new_query->execute();
        return $new_query->fetchAll(PDO::FETCH_ASSOC);
    }

    function add_node($fullname, $address, $number)
    {
        $new_query = $this->current_db()->prepare('INSERT INTO spravochnik(fullname,address,phone_num,create_date,upd_date) VALUES (:fullname,:address,:phone_num,NOW(),NOW())');
        $new_query->bindParam("fullname", $fullname, PDO::PARAM_STR);
        $new_query->bindParam("address", $address, PDO::PARAM_STR);
        $new_query->bindParam("phone_num", $number, PDO::PARAM_STR);
        $new_query->execute();
        return false;
    }

    function delete_node($node_id){
        $new_query = $this->current_db()->prepare("DELETE FROM spravochnik WHERE node_id = :node_id");
        $new_query->bindParam("node_id", $node_id, PDO::PARAM_INT);
        $new_query->execute();
        return false;
    }

    function check_exist_node($current_node_id)
    {
        $all_nodes = $this->get_all_nodes('1');
        if (sizeof($all_nodes) != 0) {
            foreach ($all_nodes as $node) {
                if ($node['node_id'] == $current_node_id) {
                    return false;
                }
            }
        }
        return true;
    }

    function get_addresses(){
        $addresses = $this->current_db()->query("SELECT address FROM spravochnik")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($addresses as &$address) {
            $address = mb_substr($address['address'], 0, mb_strpos($address['address'], ','));
        }
        return $addresses;
    }

    function update_node($node_id, $fullname, $address, $number)
    {
        if (!$this->check_exist_node($node_id)) {
            $new_query = $this->current_db()->prepare('UPDATE spravochnik SET fullname=:fullname,address=:address,phone_num=:phone_num,upd_date=NOW() WHERE node_id = :node_id');
            $new_query->bindParam("node_id", $node_id, PDO::PARAM_INT);
            $new_query->bindParam("fullname", $fullname, PDO::PARAM_STR);
            $new_query->bindParam("address", $address, PDO::PARAM_STR);
            $new_query->bindParam("phone_num", $number, PDO::PARAM_STR);
            $new_query->execute();
            return false;
        } else
            return true;
    }

    function search_nodes($request)
    {
        $all_nodes = $this->get_all_nodes();
        $request = explode(" ", $request);
        $results = [];
        foreach ($all_nodes as $node)
            foreach ($request as $search_word)
                if (mb_strpos($node['fullname'],$search_word)!==false || mb_strpos($node['address'],$search_word)!==false||mb_strpos($node['phone_num'],$search_word)!==false)
                    if (!in_array($node,$results))
                        $results[]=$node;
                    else
                        break;
        return $results;
    }
}