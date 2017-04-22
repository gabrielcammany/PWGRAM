<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 12/04/2017
 * Time: 1:48
 */

namespace PwGram\Controller;


use PwGram\Model\SignUp;
use PwGram\Model\Upload;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;


class RegistrationController
{

    public function registrationController(Application $app, Request $request){
        //echo "LLEGO AL CONTROLLER";

        $signUp = new SignUp($request);

        return $signUp->registerUser();
   }

    public function uploadImage(Request $request){
        //echo "LLEGO AL CONTROLLER";
        $upload = new Upload($request);

        return $upload->saveImage();
    }
}