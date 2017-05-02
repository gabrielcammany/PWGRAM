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
use PwGram\Model\Image;

class ImageController
{
    public function addImage(Application $app,Request $request){

        $content=$app['twig']->render('addImage.twig', array(
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

    public function renderImage(Application $app,Request $request){
        $actual_link = $_SERVER['REQUEST_URI'];
        $data = explode('/',$actual_link);
        echo $data[2];
        $content=$app['twig']->render('unicImage.twig', array(
            'app' => [
                'name'=>$app['app.name'],
                'username' => $app['session']->get('username'),
                'image_id'=> $data[2],
                'img' => $app['session']->get('img')

            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;
    }

    public function addNewImage(Request $request,Application $app){
        $upload = new Image($request,$app);
        return $upload->addNewImage();
    }


    public function getImageInfo(Request $request,Application $app){
        $upload = new Image($request,$app);
        return $upload->getInfoUnicImage();
    }

    /**
     * @param Request $request
     * @param Application $app
     * @return 
     */
    public function getListImages(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->getListImages();
    }
    public function getListUserImages(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->getListImages();
    }

    /**
     * Solicitem a la base de dades les imatges més vistes.
     *
     * @param Request $request
     * @param Application $app
     * @return lista de las más vistas
     *
     */
    public function getPopularImages(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->getListPopularImages();
    }

    /**
     * Funcio que s'encarrega d'incrementar els likes de la imatge.
     *
     * @param Request $request
     * @param Application $app
     * @return mixed
     */
    public function incLike(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->newLike();
    }

    /**
     * Funcio que s'encarrega d'incrementar els likes de la imatge.
     *
     * @param Request $request
     * @param Application $app
     * @return mixed
     */
    public function removeLike(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->dislike();
    }
    
    public function deleteImage(Request $request,Application $app)
    {
        $image = new Image($request, $app);

        return $image->dropImage();
    }
    public function editImageInfo(Request $request,Application $app)
    {
        $image = new Image($request,$app);
        return $image->editImage();
    }
}