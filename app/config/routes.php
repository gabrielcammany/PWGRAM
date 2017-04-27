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
    if($app['session']->get('id') == 0){
        if(!empty($_COOKIE['id_s'])){
            $sql = "SELECT id,username FROM user WHERE sessionID=?";
            $result = $app['db']->fetchAssoc($sql,array($_COOKIE['id_s']));
            if($result){
                $app['session']->set('id',$result['id']);
                $app['session']->set('username',$result['username']);
            }
        }
    }
};

$beforeLogged = function (Request $request, Application $app){
    if($app['session']->get('id') == 0){
        if(!empty($_COOKIE['id_s'])){
            $sql = "SELECT id,username FROM user WHERE sessionID=?";
            $result = $app['db']->fetchAssoc($sql,array($_COOKIE['id_s']));
            if(!$result){
                $response = new Response();
                $content = $app['twig']->render('error.twig', [
                    'message' => 'You must be logged'
                ]);
                $response->setContent($content);
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                return $response;
            }else{
                $app['session']->set('id',$result['id']);
                $app['session']->set('username',$result['username']);
            }
        }else {
            $response = new Response();
            $content = $app['twig']->render('error.twig', [
                'message' => 'You must be logged'
            ]);
            $response->setContent($content);
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            return $response;
        }
    }
};

$app->get('','PwGram\\Controller\\HelloController::indexAction')->before($before);
$app->get('/samu','PwGram\\Controller\\HelloController::indexSamu');
$app->get('/edit_profile','PwGram\\Controller\\EditController::editProfile')->before($beforeLogged);
$app->get('/validate/{username}/{token}/','PwGram\\Controller\\ConfirmController::confirmController');
$app->get('/profile/{username}','PwGram\\Controller\\ProfileController::profileOwner');
$app->get('/add_image','PwGram\\Controller\\ImageController::addImage')->before($beforeLogged);
$app->post('/update','PwGram\\Controller\\UpdateController::updateUser');
$app->post('/signup','PwGram\\Controller\\RegistrationController::registrationController');
$app->post('/signin','PwGram\\Controller\\LoginController::loginController');
$app->post('/upload','PwGram\\Controller\\RegistrationController::uploadImage');
$app->post('/uploadNewImage','PwGram\\Controller\\ImageController::addNewImage');
$app->post('/update','PwGram\\Controller\\UpdateController::updateUser');
$app->post('/getProfileImages','PwGram\\Controller\\ImageController::getListUserImages');
$app->post('/getRecentImages','PwGram\\Controller\\ImageController::getListImages');
$app->post('/popular_images','PwGram\\Controller\\ImageController::getPopularImages');
$app->post('/incLike','PwGram\\Controller\\ImageController::incLike');
$app->post('/removeLike','PwGram\\Controller\\ImageController::removeLike');

