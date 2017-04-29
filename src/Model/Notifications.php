<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:37
 */

namespace PwGram\Model;

use PDO;

class Notifications
{
    private $request;
    private $app;

    public function __construct($request,$app)
    {
        $this->request = $request;
        $this->app = $app;
        return $this;
    }

    public function getNotifications()
    {
        $id = $this->app['session']->get('id');
        if($_POST['dropdown'] == "1"){
            $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT * FROM notification WHERE user_id = ? ORDER BY created_at DESC LIMIT 10');
            $stmt->bindParam(1, $id , \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }else{
            $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT * FROM notification WHERE user_id = ? ORDER BY created_at DESC');
            $stmt->bindParam(1, $id , \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }
        return json_encode($result);
    }

}

