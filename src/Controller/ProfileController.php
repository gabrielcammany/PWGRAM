<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:47
 */

namespace PwGram\Controller;

use PwGram\Model\Profile;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use PwGram\Model\Image;

class ProfileController
{
    public function profileOwner(Request $request,Application $app,$username){
        $response=new Response();

        $img = new Image($request,$app);
        $sql = "SELECT id,img_path,posts,comments,email,birthdate FROM user WHERE username = ?";
        $get = $app['db']->fetchAssoc($sql,array($username));

        if(!$get){
            $content = $app['twig']->render('error.twig',[
                'message' => '404 NOT FOUND',
                'app' => ['username' => ""],
                'img' => $app['session']->get('img'),
                'idUser' => $app['session']->get('id')
            ]);
            $response->setContent($content);
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }else {
            if ($get['id'] == $app['session']->get('id')) {
                $edit = true;
            } else {
                $edit = false;
            }
            $_POST['myData'] = $get['id'];
            $img_path_100 = str_replace(".jpg", "_100.jpg", $get['img_path']);
            $img_path_400 = str_replace(".jpg", "_400.jpg", $get['img_path']);
            $list = json_decode($img->getListUserImages());
            $listComments = "";

            $listLikes = "";
            if ($list != null) {
                $img = new Image($request, $app);
                $listComments = json_decode($img->getListCommentsUserImages());

                $img = new Image($request, $app);
                $listLikes = json_decode($img->getListLikesUserImages());
                foreach( $listComments as $img){
                    $img->username = $username;
                }
                foreach( $listLikes as $img){
                    $img->username = $username;
                }
                foreach( $list as $img){
                    $img->username = $username;
                }
            }
            $content = $app['twig']->render('profile.twig', array(
                'app' => [
                    'user' => [
                        'name' => $username,
                        'posts' => $get['posts'],
                        'comments' => $get['comments'],
                        'id' => $get['id'],
                        'email' => $get['email'],
                        'date' => str_replace("-", "/", $get['birthdate']),
                        'img_path' => [
                            'cien' => $img_path_100,
                            'cuatro' => $img_path_400,
                        ]
                    ],
                    'name' => $app['app.name'],
                    'idUser' => $app['session']->get('id'),
                    'client' => [
                        'edit' => $edit,
                    ],
                    'username' => $app['session']->get('username'),
                    'img' => $app['session']->get('img')
                ],
                'images' => [
                    'list_images' => $list,
                    'list_comments' => $listComments,
                    'list_likes'=> $listLikes

                ]
            ));
        }
        $response->setStatusCode($response::HTTP_OK);
        //}

        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);
        return $response;
    }
    public function getUserInfo(Application $app,Request $request){
        $notification = new Profile($request,$app);

        return $notification->getInfo();
    }

}