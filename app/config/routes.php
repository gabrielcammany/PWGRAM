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

/**
 * @param Request $request
 * @param Application $app
 * @return Retona una response diciendo si hay cookies de usuario y por lo tanto lo logueamos
 */
$before = function (Request $request, Application $app){
    if($app['session']->get('id') == 0){
        if(!empty($_COOKIE['id_s'])){
            $sql = "SELECT id,username,img_path FROM user WHERE sessionID=?";
            $result = $app['db']->fetchAssoc($sql,array($_COOKIE['id_s']));
            if($result){
                $app['session']->set('id',$result['id']);
                $app['session']->set('username',$result['username']);
                $app['session']->set('img',$result['img_path']);
            }else{
                $app['session']->set('id',0);
            }
        }
    }
};

/**
 * @param Request $request
 * @param Application $app
 * @return Response
 *
 * Funcion que nos indica si el usuario esta logueado o no
 */
$beforeLogged = function (Request $request, Application $app){
    if($app['session']->get('id') == 0){
        if(!empty($_COOKIE['id_s'])){
            $sql = "SELECT id,username FROM user WHERE sessionID=?";
            $result = $app['db']->fetchAssoc($sql,array($_COOKIE['id_s']));
            if(!$result){
                $response = new Response();
                $content = $app['twig']->render('error.twig', [
                    'message' => '403 Forbidden',
                    'app' => [
                        'username'=> "",
                        'idUser'   => $app['session']->get('id')
                    ]
                ]);
                $app['session']->set('id',0);
                $response->setContent($content);
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                return $response;
            }else{
                $app['session']->set('id',$result['id']);
                $app['session']->set('username',$result['username']);
                $app['session']->set('img',$result['img_path']);
            }
        }else {
            $response = new Response();
            $content = $app['twig']->render('error.twig', [
                'message' => '403 Forbidden',
                'app' => [
                    'username'=> "",
                    'idUser'   => $app['session']->get('id')
                ],
            ]);
            $app['session']->set('id',0);
            $response->setContent($content);
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            return $response;
        }
    }
};

/**
 * Rutas para ir a las diferentes paginas, la primera es general para la pagina principal
 */

$app->get('','PwGram\\Controller\\HelloController::indexAction')->before($before);
$app->post('/popular_images','PwGram\\Controller\\ImageController::getPopularImages');
$app->post('/getRecentImages','PwGram\\Controller\\ImageController::getListImages');
$app->post('/getFiveMorePop','PwGram\\Controller\\ImageController::getFivePop');
$app->post('/getFiveMoreRec','PwGram\\Controller\\ImageController::getFiveRec');

/**
 * Rutas relacionadas con el registro y login
 */

$app->post('/signup','PwGram\\Controller\\RegistrationController::registrationController');
$app->post('/signin','PwGram\\Controller\\LoginController::loginController');
$app->get('/validate/{username}/{token}/','PwGram\\Controller\\ConfirmController::confirmController');
$app->post('/upload','PwGram\\Controller\\RegistrationController::uploadImage');//Añadir imagen del usuario(FALTA)

/**
 * Rutas relacionadas con ver el perfil y editarlo
 */

$app->get('/profile/{username}','PwGram\\Controller\\ProfileController::profileOwner');
$app->post('/update','PwGram\\Controller\\UpdateController::updateUser');
$app->post('/getProfileImages','PwGram\\Controller\\ImageController::getListUserImages');

/**
 * Rutas relacionadas con añadir una nueva imagen
 */

$app->get('/add_image','PwGram\\Controller\\ImageController::addImage')->before($beforeLogged);
$app->post('/uploadNewImage','PwGram\\Controller\\ImageController::addNewImage')->before($beforeLogged);

/**
 * Rutas relacionadas con editar o eliminar una imagen
 */

$app->get('/image/{id}','PwGram\\Controller\\ImageController::renderImage');
$app->post('/getInfoImage','PwGram\\Controller\\ImageController::getImageInfo');
$app->post('/deleteImage','PwGram\\Controller\\ImageController::deleteImage')->before($beforeLogged);
$app->post('/editImageInfo','PwGram\\Controller\\ImageController::editImageInfo')->before($beforeLogged);

/**
 * Rutas relacionadas con los likes
 */

$app->post('/incLike','PwGram\\Controller\\ImageController::incLike')->before($beforeLogged);
$app->post('/removeLike','PwGram\\Controller\\ImageController::removeLike');

/**
 * Rutas relacionadas con los comentarios
 */

$app->get('/comentarios','PwGram\\Controller\\CommentsController::showUserComments')->before($beforeLogged);
$app->post('/addComment','PwGram\\Controller\\CommentsController::addCommentImage')->before($beforeLogged);
$app->post('/deleteComment','PwGram\\Controller\\CommentsController::deleteCommentImage')->before($beforeLogged);
$app->post('/updateCommentBox','PwGram\\Controller\\CommentsController::getLastMessages')->before($beforeLogged);
$app->post('/getUserComments','PwGram\\Controller\\CommentsController::getUserComments');
$app->post('/commentRemove','PwGram\\Controller\\CommentsController::removeComent')->before($beforeLogged);
$app->post('/commentedit','PwGram\\Controller\\CommentsController::editComment');
/**
 * Rutas relacionadas con las notificaciones
 */

$app->post('/getUserNotifications','PwGram\\Controller\\NotificationsController::getUserNotifications');
$app->get('/notificaciones','PwGram\\Controller\\NotificationsController::showUserNotifications')->before($beforeLogged);
$app->post('/getNumNotifications','PwGram\\Controller\\NotificationsController::getNotificationsNumber');
$app->post('/notificationSeen','PwGram\\Controller\\NotificationsController::setNotificationSeen');

//Esta no se donde va porque dice comment info pero coje el username y la image_path
$app->post('/getUserCommentInfo','PwGram\\Controller\\ProfileController::getUserInfo');




/**
 * RUTAS A BORRAR!!!!!
 */
$app->get('/samu','PwGram\\Controller\\HelloController::indexSamu');
