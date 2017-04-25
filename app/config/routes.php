<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 03/04/2017
 * Time: 15:45
 */
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$before = function (Request $request, Application $app){
    if(!$app['session']->has('id')){
        $response = new Response();
        $content = $app['twig']->render('error.twig',[
            'message' => 'You must be logged'
        ]);
        $response->setContent($content);
        $response->setStatusCode(Response::HTTP_FORBIDDEN);
        return $response;
    }
};

$app->get('','PwGram\\Controller\\HelloController::indexAction');
$app->get('/samu','PwGram\\Controller\\HelloController::indexSamu');
$app->get('/edit_profile','PwGram\\Controller\\EditController::editProfile');
$app->get('/validate/{username}/{token}/','PwGram\\Controller\\ConfirmController::confirmController');
$app->get('/profile/{username}','PwGram\\Controller\\ProfileController::profileOwner');
$app->get('/add_image','PwGram\\Controller\\ImageController::addImage')->before($before);
$app->post('/update','PwGram\\Controller\\UpdateController::updateUser');
$app->post('/signup','PwGram\\Controller\\RegistrationController::registrationController');
$app->post('/signin','PwGram\\Controller\\LoginController::loginController');
$app->post('/upload','PwGram\\Controller\\RegistrationController::uploadImage');
$app->post('/uploadNewImage','PwGram\\Controller\\ImageController::addNewImage');
$app->post('/update','PwGram\\Controller\\UpdateController::updateUser');
$app->post('/getProfileImages','PwGram\\Controller\\ImageController::getImages');

