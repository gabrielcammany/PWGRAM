<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 03/04/2017
 * Time: 15:45
 *//*
$app->get('/hello/{name}',function($name) use ($app){
    return $app['twig']->render('hello.twig',array(
        'user' => $name,
    ));
});*/
$app->get('/hello/{name}','PwGram\\Controller\\HelloController::indexAction');
$app->get('add/{num1}/{num2}','PwGram\\Controller\\HelloController::addAction');