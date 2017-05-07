<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:37
 */

namespace PwGram\Model;

use PDO;
use \Datetime;

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

    public function getNumber(){
        $id = $this->app['session']->get('id');
        $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
        $stmt = $db->prepare('SELECT COUNT(id) FROM notification WHERE user_id = ? AND seen_by_user=0 AND NOT user_fired_event=?;');
        $stmt->bindParam(1, $id , \PDO::PARAM_STR);
        $stmt->bindParam(2, $id , \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return json_encode($result);
    }

    public function setSeen(){
        if(isset($_POST['index'])){
            try {
                $id = $_POST['index'];
                $get = $this->app['db']->update('notification',
                    array(
                        'seen_by_user' => 1
                    ),
                    array(
                        'id' => $id
                    )
                );
                var_dump($get);
               /* $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                $stmt = $db->prepare('UPDATE notification SET seen_by_user =1 WHERE id=?;');
                $stmt->bindParam(1, $id, \PDO::PARAM_STR);
                $stmt->execute();
                $result = $stmt->rowCount();*/
            }catch(\Exception $e){
                $get = false;
            }
            return $get;
        }
    }

    public function getNotifications()
    {
        $id = $this->app['session']->get('id');
        if($_POST['dropdown'] == "1"){
            $result = $this->app['db']->fetchAll(
                'SELECT * FROM notification WHERE user_id = ? AND seen_by_user = ? AND NOT user_fired_event=? ORDER BY created_at DESC LIMIT ?',
                array(
                    $id, 0, $id, 4
                )
            );
            /*$db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT * FROM notification WHERE user_id = ? AND seen_by_user=0 AND NOT user_fired_event=? ORDER BY created_at DESC LIMIT 4 ');
            $stmt->bindParam(1, $id , \PDO::PARAM_STR);
            $stmt->bindParam(2, $id , \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
            for($i = 0;$i<count($result);$i++){
                $result2 = $this->app['db']->fetchColumn(
                    'SELECT username FROM user WHERE id = ?',
                    array($result[$i]["user_fired_event"])
                );
                /*$stmt = $db->prepare('SELECT username FROM user WHERE id = ?');
                $stmt->bindParam(1, $result[$i]["user_fired_event"] , \PDO::PARAM_STR);
                $stmt->execute();
                $result2 = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
                $result[$i]["user_fired_event"] = $result2;
                $result3 = $this->app['db']->fetchColumn(
                    'SELECT title FROM image WHERE id = ?',
                    array($result[$i]["post_id"])
                );
                /*$stmt = $db->prepare('SELECT title FROM image WHERE id = ?');
                $stmt->bindParam(1, $result[$i]["post_id"] , \PDO::PARAM_STR);
                $stmt->execute();
                $result3 = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
                $result[$i]["post_id"] = $result[$i]["post_id"]."_".$result3;
            }
        }else{
            $result = $this->app['db']->fetchAll(
                'SELECT * FROM notification WHERE user_id = ? AND seen_by_user=? AND NOT user_fired_event=? ORDER BY created_at DESC',
                array($id,0,$id)
            );
            /*$db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT * FROM notification WHERE user_id = ? AND seen_by_user=0 AND NOT user_fired_event=? ORDER BY created_at DESC');
            $stmt->bindParam(1, $id , \PDO::PARAM_STR);
            $stmt->bindParam(2, $id , \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
            for($i = 0;$i<count($result);$i++){
                $result2 = $this->app['db']->fetchColumn(
                    'SELECT username FROM user WHERE id = ?',
                    array($result[0]["username"])
                );
               /* $stmt = $db->prepare('SELECT username FROM user WHERE id = ?');
                $stmt->bindParam(1, $result[$i]["user_fired_event"] , \PDO::PARAM_STR);
                $stmt->execute();
                $result2 = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
                $result[$i]["user_fired_event"] = $result2;
                $result2 = $this->app['db']->fetchColumn(
                    'SELECT title FROM image WHERE id = ?',
                    array($result[$i]["post_id"])
                );
                /*$stmt = $db->prepare('SELECT title FROM image WHERE id = ?');
                $stmt->bindParam(1, $result[$i]["post_id"] , \PDO::PARAM_STR);
                $stmt->execute();
                $result2 = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
                $result[$i]["post_id"] = $result[$i]["post_id"]."_".$result2;
            }
        }
        return json_encode($result);
    }

}

