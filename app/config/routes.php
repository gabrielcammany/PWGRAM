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
$app->get('','PwGram\\Controller\\HelloController::indexAction');
$app->get('/samu','PwGram\\Controller\\HelloController::indexSamu');
$app->get('/samu/edit_profile','PwGram\\Controller\\EditController::editProfile');
$app->get('/manel','PwGram\\Controller\\HelloController::indexManu');
$app->get('/add_image','PwGram\\Controller\\ImageController::addImage');
$app->get('add/{num1}/{num2}','PwGram\\Controller\\HelloController::addAction');
$app->post('/signup','PwGram\\Controller\\RegistrationController::registrationController');
$app->post('/signin','PwGram\\Controller\\LoginController::loginController');
$app->post('/upload','PwGram\\Controller\\RegistrationController::uploadImage');
$app->post('/uploadNewImage','PwGram\\Controller\\ImageController::addNewImage');
$app->post('/update','PwGram\\Controller\\UpdateController::updateUser');
