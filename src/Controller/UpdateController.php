<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 19/04/2017
 * Time: 19:30
 */

namespace PwGram\Controller;


use PwGram\Model\Image;
use PwGram\Model\Update;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class UpdateController
{
    public function updateUser(Application $app, Request $request){
    $update = new Update($app,$request,new Image($request,$app));
    return $update->updateUser();
    }
}