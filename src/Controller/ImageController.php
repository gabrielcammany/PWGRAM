<?php
/**
 * Created by PhpStorm.
 * User: Uni
 * Date: 19/04/2017
 * Time: 16:34
 */

namespace PwGram\Controller;


use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ImageController
{
    public function addImage(Application $app,Request $request){
        //$name=$request->query->get('name');
        $content=$app['twig']->render('addImage.twig', array(
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