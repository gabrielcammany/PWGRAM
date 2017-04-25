<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 12/04/2017
 * Time: 1:48
 */

namespace PwGram\Controller;


use PwGram\Model\SignUp;
use PwGram\Model\Image;
use Silex\Application;
//use PwGram\Model;

use Symfony\Component\HttpFoundation\Response;




class EditController
{

    public function editProfile(Application $app){
        /*$name=$request->query->get('name');
        $content=$app['twig']->render('hello.twig', array(
            'user'=> $name,
            'app' => [
                'name'=>$app['app.name']
            ]
            ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);
        */
        $content=$app['twig']->render('edit_profile.twig', array(
            'user'=> 'samu',
            'app' => [
                'name'=>$app['app.name']
            ]
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);
        return $response;
    }
}