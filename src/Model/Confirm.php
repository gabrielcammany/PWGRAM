<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:37
 */

namespace PwGram\Model;

use PHPMailer;

class Confirm
{
    private $request;
    private $status=0;
    private $app;

    public function __construct($request,$app)
    {
        $this->request = $request;
        $this->app = $app;
        return $this;
    }

    public function confirm($token,$username)
    {
        $sql = 'SELECT id,active,email,username FROM user WHERE username=?';
        $result = $this->app['db']->fetchAssoc($sql,array(
            $username
        ));

        if(sizeof($result['id']) == 0){
            $this->status = 0;
        }else if($result['active'] == 1){
            $this->status = 1;
        }else if(md5(($result['email'].$username."b2891fceefe96e96c97d7b7a014fe2eb")) != $token ){
            $this->status = 2;
        }else if(mkdir('assets/img/users/'.$result['id'],0777)){

            copy(__DIR__.'/../../web/assets/img/tmp/'.$username.'.png','assets/img/users/'.$result['id'].'/profileImage.jpg');
            $img=new Image($this->request,$this->app);
            $img->resize_process('assets/img/users/'.$result['id'].'/profileImage.jpg');
            $this->app['db']->update('user',
                array(
                    'active' => 1,
                    'img_path' => 'assets/img/users/'.$result['id'].'/profileImage.jpg'
                ),
                array(
                    'id' => $result['id']
                )
            );

            $this->status = 3;
            $this->app['session']->set('id',$result['id']);
            $this->app['session']->set('username',$result['username']);
            $this->app['session']->set('img','assets/img/users/'.$result['id'].'/profileImage.jpg');

        }else{
            $this->status = 4;
        }
        return $this->status;
    }

}

