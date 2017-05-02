<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:47
 */

namespace PwGram\Controller;

use PwGram\Model\Comments;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CommentsController
{
    public function addCommentImage(Request $request,Application $app){
        $notification = new Comments($request,$app);

        return $notification->addComment();

    }

    public function deleteCommentImage(Request $request,Application $app){
        $notification = new Comments($request,$app);

        return $notification->deleteComment();

    }

    public function getLastMessages(Request $request,Application $app){
        $notification = new Comments($request,$app);

        return $notification->getLast();

    }


    public function getUserComments(Request $request,Application $app){
        $notification = new Comments($request,$app);

        return $notification->getComments();

    }

    public function showUserComments(Application $app){
        $content=$app['twig']->render('comments.twig', array(
            'app' => [
                'name'=>$app['app.name'],
                'username' => $app['session']->get('username'),
                'img' => $app['session']->get('img')

            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);
        return $response;
    }

    public function removeComent(Request $request,Application $app){
        $notification = new Comments($request,$app);

        return $notification->deleteComment();

    }

}