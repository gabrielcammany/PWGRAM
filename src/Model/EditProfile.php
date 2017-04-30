<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 19/04/2017
 * Time: 16:07
 */

namespace PwGram\Model;


class EditProfile
{
    private $request;

    public function __construct($request)
    {
        $this->request = $request;
        return $this;
    }
    public function editProfile(){

        return 1;
    }
}