<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:47
 */

namespace PwGram\Controller;

use PwGram\Model\SignIn;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class LoginController
{
    public function loginController(Application $app, Request $request){
        $login = new SignIn($request);

        return $login->signIn();
    }
}