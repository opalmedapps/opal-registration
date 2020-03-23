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
use \Kreait\Firebase\Exception\FirebaseException;


$verifyBranch = strip_tags($_POST["branch"]);
//$verifyBranch = strip_tags($_GET["KJ45102178280"]);


try {
    $serviceAccount = ServiceAccount::fromJsonFile(dirname(__DIR__).'/service-account.json');
    $firebase = (new Factory)
        ->withServiceAccount($serviceAccount)
        ->withDatabaseUri($config["databaseURL"])
        ->create();
    $parentBranch = $firebase->getDatabase()->getReference($config["firebaseBranch"]["parentBranch"]);
    $childMainBranch = $parentBranch->getChild($config["firebaseBranch"]["firebaseChildBranch"]);

    $childBranch = $childMainBranch->getChild($verifyBranch);
    $snapshot = $childBranch->getSnapshot();
    $result = $snapshot->exists();

    $result = ($result?"1":"0");
    $code = HTTP_STATUS_SUCCESS;


} catch (FirebaseException $e) {
    $result = "Error code - " . $e->getMessage();
    $code = HTTP_STATUS_INTERNAL_SERVER_ERROR;
}

$resultat = array("result"=>"$result");

http_response_code($code);
header('Content-Type: application/json');
print json_encode($resultat);
exit();