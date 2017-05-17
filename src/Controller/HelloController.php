<?php
namespace  PwGram\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use PwGram\Model\Image;
use PwGram\Model\Profile;

class HelloController{
    public function indexAction(Application $app,Request $request){
        $image = new Image($request,$app);
        $pr = new Profile($request,$app);
        $pop = json_decode($image->getListPopularImages());
        foreach( $pop as $img){
            $uname =$pr->getUsername($img->user_id);
            $img->username = json_decode($uname)[0]->username;
        }
        foreach( $pop as $img){
            $uname =$pr->getUsername($img->user_id);
            $img->username = json_decode($uname)[0]->username;
        }
        $rec = json_decode($image->getListImages());
        foreach( $rec as $img){
            $uname =$pr->getUsername($img->user_id);
            $img->username = json_decode($uname)[0]->username;
        }
        $content=$app['twig']->render('home.twig', array(
            'app' => $app['defaultParams'](1),
            'images' => [
                'populares' => $pop,
                'recientes' => $rec
            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;
    }
}