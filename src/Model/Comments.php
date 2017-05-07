<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:37
 */

namespace PwGram\Model;

use Doctrine\DBAL\Connection;
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
            if($data->text != ""){
                $id = $this->app['session']->get('id');
                try{
                    $sql = 'SELECT COUNT(id) FROM comment WHERE user_id=? AND image_id=?';
                    $result = $this->app['db']->fetchAll($sql,array(
                        $id,
                        $data->image_id
                    ));

                    $done = $this->app['db']->executeUpdate(
                        'UPDATE image SET comments = comments + 1 WHERE id = ?',
                        array($data->image_id)
                    );
                    if($done != 0){

                    }
                    if($result[0]["COUNT(id)"]==0){
                        $date = date('Y/m/d H:i:s');
                        $this->app['db']->insert('comment',array(
                            'text' => $data->text,
                            'user_id' => $id,
                            'image_id' => $data->image_id,
                            'created_at' => $date
                        ));
                        $this->app['db']->insert('notification',array(
                            'user_id'=>$data->user_id,
                            'user_fired_event' => $id,
                            'event_id' => 2,
                            'post_id' => $data->image_id,
                            'created_at' => $date
                        ));
                    }
                }catch (\Exception $e){
                    $result = $e->getMessage();
                }
            }else{
                $result = 1;
            }

        }
        return json_encode($result);
    }


    public function getLast(){
        $result = "1";
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            $sql = 'SELECT text,user_id,created_at,image_id FROM comment WHERE image_id = ?  ORDER BY created_at DESC LIMIT 3;';
            $result = $this->app['db']->fetchAll($sql,array(
                $data->image_id
            ));
           /* $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT text,user_id,created_at,image_id FROM comment WHERE image_id = ?  ORDER BY created_at DESC LIMIT 3;');
            $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
            if(count($result) != 0) {
                $query = str_repeat("?,", count($result) - 1) . "?";
                //$sql = 'SELECT id,username,img_path FROM user WHERE id IN (' . $query . ');';
                $sql = 'SELECT id,username,img_path FROM user WHERE id IN (?);';
                $array = array();
               // $stmt = $db->prepare('SELECT id,username,img_path FROM user WHERE id IN (' . $query . ');');
                $limit = count($result);
                //$j = 0;
                for ($i = 0; $i < $limit; $i++) {
                   // $stmt->bindParam($i, $result[$j]["user_id"], \PDO::PARAM_STR);
                    $array[$i] = $result[$i]["user_id"];
                    //$j++;
                }
                $stmt = $this->app['db']->executeQuery($sql,array($array),array(Connection::PARAM_INT_ARRAY));
                $result3 = $stmt->fetchAll();
               // $stmt->execute();
                //$result3 = $stmt->fetchAll(\PDO::FETCH_ASSOC);
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
        $sql = 'SELECT text,created_at,image_id FROM comment WHERE user_id = ? ORDER BY created_at DESC;';
        $result = $this->app['db']->fetchAll($sql,array(
            $id
        ));
        /*$db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
        $stmt = $db->prepare('SELECT text,created_at,image_id FROM comment WHERE user_id = ? ORDER BY created_at DESC;');
        $stmt->bindParam(1, $id, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
        //if(count($result) != 0) {
            for ($i = 0; $i < count($result); $i++) {
                $sql = 'SELECT title FROM image WHERE id = ?';
                $result2 = $this->app['db']->fetchColumn($sql,array(
                    $result[$i]["image_id"]
                ));
                /*$stmt = $db->prepare('SELECT title FROM image WHERE id = ?');
                $stmt->bindParam(1, $result[$i]["image_id"] , \PDO::PARAM_STR);
                $stmt->execute();
                $result2 = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
                $result[$i]["image_id"] = $result[$i]["image_id"]."_".$result2;
            }
        //}
        return json_encode($result);
    }


    public function deleteComment(){
        $result = 0;
        if(!empty($_POST['index'])) {
            $data = json_decode($_POST['index']);
            $id = $this->app['session']->get('id');
            try{
                $this->app['db']->delete('comment',array(
                    'user_id' => $id,
                    'image_id' => $data
                ));
                $done = $this->app['db']->executeUpdate(
                    'UPDATE image SET comments = comments -1 WHERE id = ?',
                    array($data)
                );
            }catch (\Exception $e){
                $result = 1;
            }

        }
        return json_encode($result);
    }


}

