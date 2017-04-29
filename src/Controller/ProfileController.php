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

class ProfileController
{
    public function profileOwner(Application $app,$username){
        $response=new Response();
        $sql = "SELECT * FROM user WHERE username = ?";
        $get = $app['db']->fetchAssoc($sql,array($username));

        if(!$get){
            $content = $app['twig']->render('error.twig',[
                'message' => 'USER NOT FOUND',
            ]);
            $response->setContent($content);
            $response->setStatusCode(Response::HTTP_NOT_FOUND);
        }else{
            if($get['id'] == $app['session']->get('id')){
                $edit = true;
            }else{
                $edit = false;
            }
            //$string = strval($username . ",".$get['date']. ',' .$get['email']);
            $content=$app['twig']->render('profile.twig', array(
                'app' => [
                    'user' =>[
                        'name' =>$username,
                        'posts' =>$get['posts'],
                        'comments' =>$get['comments'],
                        'id' => $get['id'],
                        'email' => $get['email'],
                        'date' => $get['birthdate'],
                        'img_path' => $get['img_path']
                    ],
                    'name'=>$app['app.name'],
                    'client' =>[
                        'edit' => $edit,
                    ],
                    'username' => $app['session']->get('username')

                ],

            ));

            $response->setStatusCode($response::HTTP_OK);
        }

        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;
    }
}