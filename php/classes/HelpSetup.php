<?php
/**
 * User: Dominic Bourdua
 * Date: 8/1/2019
 * Time: 9:21 AM
 */

class HelpSetup {
    /*
     * Basic functions to return an error message to the caller
     * */
    public static function returnErrorMessage($errcode, $details = null) {
        $details = trim($details);
        http_response_code($errcode);
        if($details != "") {
            header('Content-Type: application/json');
            echo $details;
        }
        die();
    }
    public static function getIpAddress() {
        if(!empty($_SERVER['HTTP_CLIENT_IP'])){
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }else{
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
}