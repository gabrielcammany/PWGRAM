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



$beforeImage = function (Request $request, Application $app){
    $response=new Response();
    $actual_link = $_SERVER['REQUEST_URI'];
    $data = explode('/',$actual_link);
    $actualUser = $app['session']->get('id');

    $result = $app['db']->fetchAssoc(
        'SELECT user_id, private FROM image WHERE id = ?',
        array($data[2])
    );

    $username = $app['db']->fetchAssoc(
        'SELECT username FROM user WHERE id = ?',
        array($result['user_id'])
    );
    $edit = false;
    if($actualUser == $result['user_id']){
        $edit = true;
    }
    if(!empty($result)){
        if($result['private'] == 1 && !$edit){
            $content = $app['twig']->render('error.twig', [
                'message' => 'No tienes permisos para acceder',
                'numError' => 403,
                'app' => [
                    'name'=>$app['app.name'],
                    'username' => $app['session']->get('username'),
                    'image_id'=> $data[2],
                    'img' => $app['session']->get('img'),
                    'idUser'   => $app['session']->get('id'),
                    'user'=>$username
                ]
            ]);
            $response->setContent($content);
            $response->setStatusCode(403);
            return $response;
        }
    }else{
        $content = $app['twig']->render('error.twig', [
            'message' => 'Página no encontrada',
            'numError' => 404,
            'app' => [
                'name'=>$app['app.name'],
                'username' => $app['session']->get('username'),
                'image_id'=> $data[2],
                'img' => $app['session']->get('img'),
                'idUser'   => $app['session']->get('id')

            ],

        ]);
        $response->setContent($content);
        $response->setStatusCode(404);
        return $response;

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

$app->get('/image/{id}','PwGram\\Controller\\ImageController::renderImage')->before($beforeImage);
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
$app->post('/moreCommentsBox','PwGram\\Controller\\CommentsController::getMoreMessages');
$app->post('/getUserComments','PwGram\\Controller\\CommentsController::getUserComments');
$app->post('/commentRemove','PwGram\\Controller\\CommentsController::removeComent')->before($beforeLogged);
$app->post('/commentedit','PwGram\\Controller\\CommentsController::editComment');
$app->post('/getUserCommentInfo','PwGram\\Controller\\ProfileController::getUserInfo');


/**
 * Rutas relacionadas con las notificaciones
 */

$app->post('/getUserNotifications','PwGram\\Controller\\NotificationsController::getUserNotifications');
$app->get('/notificaciones','PwGram\\Controller\\NotificationsController::showUserNotifications')->before($beforeLogged);
$app->post('/getNumNotifications','PwGram\\Controller\\NotificationsController::getNotificationsNumber');
$app->post('/notificationSeen','PwGram\\Controller\\NotificationsController::setNotificationSeen');

$app->error(function (\Exception $exception,Request $request) use ($app){
    $response = new Response();
    $content = $app['twig']->render('error.twig', [
        'message' => 'Error',
        'numError' => 404,
        'app' => $app['defaultParams'](1)
    ]);
    $response->setContent($content);
    $response->setStatusCode(Response::HTTP_NOT_FOUND);
    return $response;
});