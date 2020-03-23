<?php
/**
 * User: Dominic Bourdua
 * Date: 8/7/2019
 * Time: 11:38 AM
 */

header('Content-Type: application/json');
include_once('validation.inc');

$ipAddress = HelpSetup::getIpAddress();

http_response_code(HTTP_STATUS_SUCCESS);
echo json_encode(array("result"=>$ipAddress));