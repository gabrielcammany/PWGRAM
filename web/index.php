<?php
ini_set('display_errors','1');
/*error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");*/
require_once  __DIR__.'/../vendor/autoload.php';
$app=require __DIR__.'/../app/app.php';
$app['debug']=true;
require __DIR__.'/../app/config/prod.php';
require __DIR__.'/../app/config/routes.php';
$app->run();