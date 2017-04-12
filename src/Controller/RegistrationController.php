<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 12/04/2017
 * Time: 1:48
 */

namespace SilexApp\Controller;


use Illuminate\Contracts\Console\Application;
use Illuminate\Support\Facades\Request;

class RegistrationController
{
   public function registerUser(Application $app,Request $request){
    echo "llega a registro!\n";
   }
}