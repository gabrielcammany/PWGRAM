<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:47
 */

namespace PwGram\Controller;

use PwGram\Model\Notifications;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class NotificationsController
{
    public function getUserNotifications(Request $request,Application $app){
        $notification = new Notifications($request,$app);

        return $notification->getNotifications();

    }


    public function getNotificationsNumber(Request $request,Application $app){
        $notification = new Notifications($request,$app);

        return $notification->getNumber();

    }

    public function showUserNotifications(Application $app){
        $content=$app['twig']->render('notifications.twig', array(
            'app' => [
                'name'=>$app['app.name'],
                'username' => $app['session']->get('username'),
                'img' => $app['session']->get('img'),
                'idUser'   => $app['session']->get('id')


            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);
        return $response;
    }
    public function setNotificationSeen(Request $request,Application $app){
        $notification = new Notifications($request,$app);

        return $notification->setSeen();
    }
}