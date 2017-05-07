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

class ProfileController
{
    public function profileOwner(Application $app,$username){
        $response=new Response();
        $sql = "SELECT * FROM user WHERE username = ?";
        $get = $app['db']->fetchAssoc($sql,array($username));

        if(!$get){
            $content = $app['twig']->render('error.twig',[
                'message' => '404 NOT FOUND',
                'app' => ['username' => ""],
                'img' => $app['session']->get('img')

            ]);
            $response->setContent($content);
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }else{
            if($get['id'] == $app['session']->get('id')){
                $edit = true;
            }else{
                $edit = false;
            }
            $img_path = $get['img_path'];
            $img_path = str_replace(".jpg","_100.jpg",$img_path);
            $content=$app['twig']->render('profile.twig', array(
                'app' => [
                    'user' =>[
                        'name' =>$username,
                        'posts' =>$get['posts'],
                        'comments' =>$get['comments'],
                        'id' => $get['id'],
                        'email' => $get['email'],
                        'date' => str_replace("-","/",$get['birthdate']),
                        'img_path' => [
                            'cien' => $img_path,
                            'cuatro' => '../assets/img/users/'.strtolower($username).'/profileImage_400.jpg'
                        ]
                    ],
                    'name'=>$app['app.name'],
                    'client' =>[
                        'edit' => $edit,
                    ],
                    'username' => $app['session']->get('username'),
                    'img' => $app['session']->get('img')


                ],

            ));

            $response->setStatusCode($response::HTTP_OK);
        }

        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);
        return $response;
    }
    public function getUserInfo(Application $app,Request $request){
        $notification = new Profile($request,$app);

        return $notification->getInfo();
    }

}