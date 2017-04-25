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
use Symfony\Component\HttpFoundation\Request;


class RegistrationController
{

    public function registrationController(Application $app, Request $request){

        $signUp = new SignUp($request,$app);

        return $signUp->registerUser();
   }

    public function uploadImage(Request $request, Application $app){
        $upload = new Image($request,$app);

        return $upload->saveImage();
    }
}