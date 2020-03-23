<?php
/**
 * User: Dominic Bourdua
 * Date: 2019-08-26
 * Time: 08:07
 */

include_once('validation.inc');

require dirname(__DIR__, 2).'/vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

try {
    $serviceAccount = ServiceAccount::fromJsonFile(dirname(__DIR__).'/service-account.json');
    $firebase = (new Factory)
        ->withServiceAccount($serviceAccount)
        ->withDatabaseUri($config["databaseURL"])
        ->create();
    $result = $firebase->getAuth()->createCustomToken(HelpSetup::random_str());
    $code = HTTP_STATUS_SUCCESS;

} catch (Exception $e) {
    $result = "An error occurred.";
    $code = HTTP_STATUS_INTERNAL_SERVER_ERROR;
}
$resultat = array("result"=>"$result");

http_response_code($code);
header('Content-Type: application/json');
print json_encode($resultat);
exit();