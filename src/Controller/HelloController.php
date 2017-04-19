<?php
namespace  PwGram\Controller;

//use Silex\Application;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class HelloController{
    public function indexAction(Application $app,Request $request){
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
        $response->setContent($content);*/

        return $app['home']('Samuel');
    }
    public function indexSamu(Application $app,Request $request){
        $content=$app['twig']->render('home_samu.twig');

        return $content;
    }
    public function indexManu(Application $app,Request $request){

        $content=$app['twig']->render('home_manu.twig');

        return $content;
    }

    public function addAction(Application $app,$num1,$num2){
        return "the result is: ".$app['calc']->add($num1,$num2);
    }

}