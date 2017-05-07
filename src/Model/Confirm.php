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
        $sql = 'SELECT * FROM user WHERE username=?';
        $result = $this->app['db']->fetchAssoc($sql,array(
            $username
        ));
        /*$db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
        $stmt = $db->prepare('SELECT * FROM user WHERE username=?');
        $stmt->bindParam(1, $username, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);*/
       // echo $result['active'];
        if(sizeof($result['id']) == 0){
            $this->status = 0;
        }else if($result['active'] == 1){
            $this->status = 1;
        }else if(md5(($result['email'].$username."b2891fceefe96e96c97d7b7a014fe2eb")) != $token ){
            $this->status = 2;
        }else if(mkdir('assets/img/users/'.strtolower($username),0777)){
            //localStorage.getItem();
            $this->app['db']->update('user',
                array(
                'active' => 1
                ),
                array(
                    'username' => $username
                ));
            /*$stmt = $db->prepare('UPDATE user SET active=1 WHERE username=?');
            $stmt->bindParam(1, $username, \PDO::PARAM_STR);
            $stmt->execute();*/
            $this->status = 3;
            $this->app['session']->set('id',$result['id']);
            $this->app['session']->set('username',$result['username']);

        }else{
            $this->status = 4;
        }
        return $this->status;
    }

}

