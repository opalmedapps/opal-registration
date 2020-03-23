<?php
/**
 * User: Dominic Bourdua
 * Date: 8/1/2019
 * Time: 9:19 AM
 */

// Set the time ze for the Eastern Time Zone (ET)
date_default_timezone_set("America/Toronto");

// Turn on all errors except for notices
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', 1);

// Get directory path of this file
$pathname 	= __DIR__;
// Strip php directory
$abspath 	= str_replace('php', '', $pathname);

// Specify location of config file
$json = file_get_contents(dirname(__DIR__).DIRECTORY_SEPARATOR."php".DIRECTORY_SEPARATOR.'config.json');

// Decode json to variable
$config = json_decode($json, true);

define( "FRONTEND_ABS_PATH", str_replace("/", DIRECTORY_SEPARATOR, $config['pathConfig']['abs_path'] ));

include_once( dirname(__DIR__) . DIRECTORY_SEPARATOR . "php". DIRECTORY_SEPARATOR . "classes". DIRECTORY_SEPARATOR . "HelpSetup.php" );
include_once( dirname(__DIR__) . DIRECTORY_SEPARATOR . "php". DIRECTORY_SEPARATOR . "classes". DIRECTORY_SEPARATOR . "Validation.php" );

define("ANY_NUMBERS", "/[^0-9]+/");
define("ANY_LETTERS", "/[^a-zA-Z]+/");
define("RAMQ_FORMAT", "/^[a-zA-Z]{4}\d{8}$/");
define("REGISTRATION_CODE_FORMAT", "/^[a-zA-Z0-9]{10}$/");

define("HTTP_STATUS_SUCCESS",200);
define("HTTP_STATUS_BAD_REQUEST_ERROR",400);
define("HTTP_STATUS_UNAUTHORIZED_ERROR",401);
define("HTTP_STATUS_FORBIDDEN_ERROR",403);
define("HTTP_STATUS_INTERNAL_SERVER_ERROR",500);
define("HTTP_STATUS_SERVICE_UNAVAILABLE_ERROR",503);