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

        $result = $this->app['db']->fetchColumn(
            'SELECT COUNT(id) FROM notification WHERE user_id = ? AND seen_by_user=0 AND NOT user_fired_event=?',
            array($id,$id)
        );

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
                'SELECT * FROM notification WHERE user_id = ? AND seen_by_user = 0 AND NOT user_fired_event=? ORDER BY created_at DESC LIMIT 4',
                array(
                    $id,
                    $id
                )
            );

            for($i = 0;$i<count($result);$i++){
                $result2 = $this->app['db']->fetchColumn(
                    'SELECT username FROM user WHERE id = ?',
                    array($result[$i]["user_fired_event"])
                );

                $result[$i]["user_fired_event"] = $result2;
                $result3 = $this->app['db']->fetchColumn(
                    'SELECT title FROM image WHERE id = ?',
                    array($result[$i]["post_id"])
                );

                $result[$i]["post_id"] = $result[$i]["post_id"]."_".$result3;
            }
        }else{
            $result = $this->app['db']->fetchAll(
                'SELECT * FROM notification WHERE user_id = ? AND seen_by_user=? AND NOT user_fired_event=? ORDER BY created_at DESC',
                array($id,0,$id)
            );

            for($i = 0;$i<count($result);$i++){
                $result2 = $this->app['db']->fetchColumn(
                    'SELECT username FROM user WHERE id = ?',
                    array($result[$i]["user_fired_event"])
                );

                $result[$i]["user_fired_event"] = $result2;
                $result2 = $this->app['db']->fetchColumn(
                    'SELECT title FROM image WHERE id = ?',
                    array($result[$i]["post_id"])
                );

                $result[$i]["post_id"] = $result[$i]["post_id"]."_".$result2;
            }
        }
        return json_encode($result);
    }

}

