<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:37
 */

namespace PwGram\Model;

use PDO;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class Comments
{
    private $request;
    private $app;

    public function __construct($request,$app)
    {
        $this->request = $request;
        $this->app = $app;
        return $this;
    }


    public function addComment(){
        $result = "";
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            $id = $this->app['session']->get('id');
            try{
                $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                $stmt = $db->prepare('SELECT COUNT(id) FROM comment WHERE user_id=? AND image_id=?;');
                $stmt->bindParam(1,$id, \PDO::PARAM_STR);
                $stmt->bindParam(2,$data->image_id, \PDO::PARAM_STR);
                $stmt->execute();
                $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                if($result[0]["COUNT(id)"]==0){
                    $date = date('Y/m/d H:i:s');
                    $stmt = $db->prepare('INSERT INTO comment(text,user_id,image_id,created_at) values(?,?,?,?);');
                    $stmt->bindParam(1, $data->text, \PDO::PARAM_STR);
                    $stmt->bindParam(2, $id, \PDO::PARAM_STR);
                    $stmt->bindParam(3, $data->image_id, \PDO::PARAM_STR);
                    $stmt->bindParam(4, $date, \PDO::PARAM_STR);
                    $stmt->execute();
                    $stmt = $db->prepare('INSERT INTO notification(user_id,user_fired_event,event_id,post_id,created_at) values(?,?,2,?,?);');
                    $stmt->bindParam(1, $data->user_id, \PDO::PARAM_STR);
                    $stmt->bindParam(2, $id, \PDO::PARAM_STR);
                    $stmt->bindParam(3, $data->image_id, \PDO::PARAM_STR);
                    $stmt->bindParam(4, $date, \PDO::PARAM_STR);
                    $stmt->execute();
                }
            }catch (\Exception $e){
                $result = $e->getMessage();
            }

        }
        return json_encode($result);
    }


    public function getLast(){
        $result = "1";
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT text,user_id,created_at,image_id FROM comment WHERE image_id = ?  ORDER BY created_at DESC LIMIT 3;');
            $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            if(count($result) != 0) {
                $query = str_repeat("?,", count($result) - 1) . "?";
                $stmt = $db->prepare('SELECT id,username,img_path FROM user WHERE id IN (' . $query . ');');
                $limit = count($result) + 1;
                $j = 0;
                for ($i = 1; $i < $limit; $i++) {
                    $stmt->bindParam($i, $result[$j]["user_id"], \PDO::PARAM_STR);
                    $j++;
                }
                $stmt->execute();
                $result3 = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                for ($i = 0; $i < count($result); $i++) {
                    $index = array_search($result[$i]["user_id"], array_column($result3,"id"));
                    $result[$i]["username"] = $result3[$index]["username"];
                    $result[$i]["img_path"] = $result3[$index]["img_path"];
                }
            }
        }
        return json_encode($result);
    }

    public function getComments(){
        $id = $this->app['session']->get('id');
        $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
        $stmt = $db->prepare('SELECT text,created_at,image_id FROM comment WHERE user_id = ? ORDER BY created_at DESC;');
        $stmt->bindParam(1, $id, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if(count($result) != 0) {
            for ($i = 0; $i < count($result); $i++) {
                $stmt = $db->prepare('SELECT title FROM image WHERE id = ?');
                $stmt->bindParam(1, $result[$i]["image_id"] , \PDO::PARAM_STR);
                $stmt->execute();
                $result2 = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $result[$i]["image_id"] = $result[$i]["image_id"]."_".$result2[0]["title"];
            }
        }
        return json_encode($result);
    }


    public function deleteComment(){
        $result = 0;
        if(!empty($_POST['index'])) {
            $data = json_decode($_POST['index']);
            $id = $this->app['session']->get('id');
            $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('DELETE FROM comment WHERE user_id = ? AND image_id=?;');
            $stmt->bindParam(1, $id, \PDO::PARAM_STR);
            $stmt->bindParam(2, $data, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }
        return json_encode($result);
    }


}

