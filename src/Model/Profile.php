<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 19/04/2017
 * Time: 16:07
 */

namespace PwGram\Model;
use PDO;

class Profile
{
    private $request;
    private $app;

    public function __construct($request,$app)
    {
        $this->request = $request;
        $this->app = $app;
        return $this;
    }
    public function getInfo(){
        $id = $this->app['session']->get('id');
        $result = $this->app['db']->fetchAll(
            'SELECT username,img_path FROM user WHERE  id=?',
            array($id)
        );
        return json_encode($result);
    }

    public function getUsername($id){
        $result = $this->app['db']->fetchAll(
            'SELECT username FROM user WHERE  id=?',
            array($id)
        );
        return json_encode($result);
    }
}