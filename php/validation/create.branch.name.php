<?php
/**
 * User: Dominic Bourdua
 * Date: 7/31/2019
 * Time: 1:11 PM
 */

header('Content-Type: application/json');
include_once('validation.inc');

$validator = new Validation();
$firebaseBranch = $validator->createBranchName($_POST);
$result = array("result"=>$firebaseBranch);

http_response_code(HTTP_STATUS_SUCCESS);
echo json_encode($result);