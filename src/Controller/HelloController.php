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
        $popList = array();
        foreach( $pop as $img){
            $uname =$pr->getUsername($img->user_id);
            $valor =json_decode($uname);
            array_push($popList,$valor[0]->username);
        }

        $rec = json_decode($image->getListImages());
        $recList = array();
        foreach( $rec as $img){
            $uname =$pr->getUsername($img->user_id);
            $valor =json_decode($uname);
            array_push($recList,$valor[0]->username);
        }
        $size_pop = count($pop);
        $size_rec = count($rec);

        $content=$app['twig']->render('home.twig', array(
            'app' => $app['defaultParams'](1),
            'images' => [
                'populares' => $pop,
                'recientes' => $rec,
                'poplength'  => $size_pop,
                'size_rec'  => $size_rec,
                'uname_pop' => $popList,
                'uname_rec' => $recList,
            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;
    }

    public function indexSamu(Application $app,Request $request){


        $image = new Image($request,$app);
        $pr = new Profile($request,$app);
        $array = json_decode($image->getListPopularImages());
        $popList = array();
        $i = 0;
        foreach( $array as $img){
            $uname =$pr->getUsername($img->user_id);
            $valor =json_decode($uname);
            array_push($popList,$valor[0]->username);

        }

        $array = json_decode($image->getListImages());
        $recList = array();
        foreach( $array as $img){
            $uname =$pr->getUsername($img->user_id);
            $valor =json_decode($uname);
            array_push($recList,$valor[0]->username);
        }
        $content=$app['twig']->render('home_samu.twig', array(
            'app' => [
                'name'     =>$app['app.name'],
                'username' => $app['session']->get('username'),
                'img'      => $app['session']->get('img'),
                'idUser'   => $app['session']->get('id')
            ],
            'images' => [
                'populares' => json_decode($image->getListPopularImages()),
                'recientes' => json_decode($image->getListImages()),
                'size_pop'  => sizeof(json_decode($image->getListPopularImages())),
                'size_rec'  => sizeof(json_decode($image->getListImages())),
                'uname_pop' => $popList,
                'uname_rec' => $recList
            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;

    }

}