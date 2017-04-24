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

    public function __construct($request)
    {
        $this->request = $request;
        return $this;
    }

    public function confirm($token,$username)
    {
        $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
        $stmt = $db->prepare('SELECT * FROM user WHERE username=?');
        $stmt->bindParam(1, $username, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        echo $result['active'];
        if(sizeof($result['id']) == 0){
            $this->status = 0;
        }else if($result['active'] == 1){
            $this->status = 1;
        }else if(md5(($result['email'].$username."b2891fceefe96e96c97d7b7a014fe2eb")) != $token ){
            $this->status = 2;
        }else{
            //localStorage.getItem();
            $stmt = $db->prepare('UPDATE user SET active=1 WHERE username=?');
            $stmt->bindParam(1, $username, \PDO::PARAM_STR);
            $stmt->execute();
            $this->status = 3;

        }
        return $this->status;
    }

}

