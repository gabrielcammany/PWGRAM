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
use PwGram\Model\Profile;

class ImageController
{
    public function addImage(Application $app,Request $request){
        $content=$app['twig']->render('addImage.twig', array(
            'app' => [
                'name'=>$app['app.name'],
                'username' => $app['session']->get('username'),
                'img' => $app['session']->get('img'),
                'idUser'   => $app['session']->get('id')


            ],
        ));
        $response=new Response();
        $response->setStatusCode($response::HTTP_OK);
        $response->headers->set('Content-Type','text/html');
        $response->setContent($content);

        return $response;
    }

    public function renderImage(Application $app,Request $request){
        $response=new Response();
        $actual_link = $_SERVER['REQUEST_URI'];
        $data = explode('/',$actual_link);
        $actualUser = $app['session']->get('id');
        $result = $app['db']->fetchAssoc(
            'SELECT user_id, private FROM image WHERE id = ?',
            array($data[2])
        );
            $edit = false;
            if($actualUser == $result['user_id']){
                $edit = true;
            }
            if ($result['private'] != 0 && !$edit){
                $content = $app['twig']->render('error.twig', [
                    'message' => '403 Forbidden',
                    'app' => [
                        'name'=>$app['app.name'],
                        'username' => $app['session']->get('username'),
                        'image_id'=> $data[2],
                        'img' => $app['session']->get('img'),
                        'idUser'   => $app['session']->get('id')

                    ]
                ]);
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
            }else{
                $_POST['id']=$data[2];
                $img = new Image($request,$app);
                $infoImage = $img->getInfoUnicImage();
                $infoImage = json_decode($infoImage);
                $path = $infoImage[0]->img_path;
                $array = explode('/',$path);
                $infoImage[0]->user_id = $array[3];
               // var_dump(count($infoImage[0]->comments));
                if(count($infoImage[0]->comments) != 0) {
                    for ($i = 0; $i < count($infoImage[0]->comments); $i++) {
                        str_replace(".jpg", "_100.jpg", $infoImage[0]->comments[$i][2]);
                        //$infoImage[0]->comments[$i][3] = $app['time']($infoImage[0]->comments[$i][3]);
                    }
                }

                $infoImage[0]->created_at = $app['time']($infoImage[0]->created_at);
                $content=$app['twig']->render('unicImage.twig', array(
                    'app' => [
                        'name'=>$app['app.name'],
                        'username' => $app['session']->get('username'),
                        'image_id'=> $data[2],
                        'img' => $app['session']->get('img'),
                        'idUser'   => $app['session']->get('id')
                    ],
                    'enableEdit' => $edit,
                    'img'=> $infoImage[0],
                    'comments' => $infoImage[0]->comments,
                    'numComments' => count($infoImage[0]->comments)
                ));
                $response->setStatusCode($response::HTTP_OK);

            }
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
     * @return listado de imagenes
     */
    public function getListImages(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->getListImages();
    }
    public function getListUserImages(Request $request,Application $app){
        $image = new Image($request,$app);

        return $image->getListUserImages();
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

    public function getFivePop(Request $request,Application $app){
        $image = new Image($request,$app);
        $profile = new Profile($request,$app);
        $result = json_decode($image->getFivePop());
        if($result != 0 && $result != 1) {


            $popList = array();

            foreach ($result as $img) {
                $userName = $profile->getUsername($img->user_id);
                $name = json_decode($userName);
                array_push($popList, $name[0]->username);
            }
            $content = $app['twig']->render('showMoreimages.twig', array(
                'app' => $app['defaultParams'](1),
                'images' => [
                    'content' => $result,
                    'size_pop' => sizeof($result),
                    'uname_pop' => $popList,
                ],
            ));

            $response = new Response();
            $response->setStatusCode($response::HTTP_OK);
            $response->headers->set('Content-Type', 'text/html');
            $response->setContent($content);
            return $response;
        }else{
            return $result;
        }
    }

    public function getFiveRec(Request $request,Application $app){
        $image = new Image($request,$app);
        $profile = new Profile($request,$app);
        $result = json_decode($image->getFiveRec());
        if($result != 0 && $result != 1) {


            $popList = array();

            foreach ($result as $img) {
                $userName = $profile->getUsername($img->user_id);
                $name = json_decode($userName);
                array_push($popList, $name[0]->username);
            }
            $content = $app['twig']->render('showMoreimages.twig', array(
                'app' => $app['defaultParams'](1),
                'images' => [
                    'content' => $result,
                    'size_pop' => sizeof($result),
                    'uname_pop' => $popList,
                ],
            ));

            $response = new Response();
            $response->setStatusCode($response::HTTP_OK);
            $response->headers->set('Content-Type', 'text/html');
            $response->setContent($content);
            return $response;
        }else{
            return $result;
        }
    }
}