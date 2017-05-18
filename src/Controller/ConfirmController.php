<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:47
 */

namespace PwGram\Controller;

use PwGram\Model\Confirm;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfirmController
{
    public function confirmController(Application $app, Request $request, $username, $token){
        $login = new Confirm($request,$app);
        $result = $app['db']->fetchColumn(
            'SELECT id FROM user WHERE username = ?',
            array($username)
        );
        $content=$app['twig']->render('confirmed.twig', array(
            'app' => [
                'name'=>$app['app.name'],
                'status'=>$login->Confirm($token,$username),
                'username' => $app['session']->get('username'),
                'img' => '../assets/img/users/'.$result.'/profileImage.jpg',
                'idUser'   => $app['session']->get('id')
            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;
    }
}