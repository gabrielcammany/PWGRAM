<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 16/04/2017
 * Time: 19:20
 */

namespace PwGram\Model;


use Doctrine\DBAL\Connection;
use PDO;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class Image
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
    public function saveImage()
    {
        if (isset($_POST['myData'])) {
            $data = json_decode($_POST['myData'],true);

            $img= $data['image'];
            $username = $data['username'];
            //$this->base64_to_jpeg($img_data, '/assets/img/tmp/'.$this->app['session']->get('username').'jpg');
            $img_path = 'assets/img/tmp/'.$username.'.jpg';
            $this->base64_to_jpeg($img, $img_path);
        }
        return 1;
    }


    function base64_to_jpeg($base64_string, $output_file) {
        $ifp = fopen($output_file, "wb");
        //echo '\n\n'.$base64_string.'\n';
        $data = explode(',', $base64_string);

        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        return $output_file;
    }

    public function addNewImage(){
        if(isset($_POST['myData'])){
            $data = json_decode($_POST['myData'],true);
            $img = $data['image'];
            $title = $data['title'];
            $private = $data['private'];
            $imgData = $data['data'];
            $id = $this->app['session']->get('id');
            if($private){
                $tinyint = 1;
            }else{
                $tinyint = 0;
            }
            if($this->validateImage($img) && $this->validateTitle($title)) {

                $date = date('Y/m/d H:i:s');
                $img_path = 'assets/img/users/'.strtolower($this->app['session']->get('username')).'/'.str_replace("/","-",$date).'.jpg';
                $img_path = str_replace(" ","_",$img_path);
                $this->base64_to_jpeg($img, $img_path);
                $this->app['db']->insert('image',array(
                    'user_id' => $id,
                    'title' => $title,
                    'img_path' => $img_path,
                    'visits' => 0,
                    'private' => $tinyint,
                    'created_at' => $date
                ));
                /*$db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                $stmt = $db->prepare('INSERT INTO image (user_id,title,img_path,visits,private,created_at) VALUES (?,?,?,0,?,?)');
                $stmt->bindParam(1, $id , \PDO::PARAM_STR);
                $stmt->bindParam(2, $title, \PDO::PARAM_STR);
                $stmt->bindParam(3, $img_path, \PDO::PARAM_STR);
                $stmt->bindParam(4, $tinyint, \PDO::PARAM_STR);
                $stmt->bindParam(5, $date, \PDO::PARAM_STR);
                $stmt->execute();*/
                //$sql = "SELECT posts FROM user WHERE id = ?";
                //NO SE PORQUE
                /*$posts = $this->app['db']->fetchColumn($sql,array(
                    $id
                ));
                */
                $get = $this->app['db']->executeUpdate(
                    'UPDATE user SET posts=posts+1 WHERE id=?',
                    array($id)
                );
                if($get == 0){
                    $this->status = 4;
                }else{
                    $this->status = 3;
                }
               /* $stmt = $db->prepare('UPDATE user SET posts=posts+1 WHERE id=?');
                $stmt->bindParam(1, $id, \PDO::PARAM_STR);
                $stmt->execute();*/
                $this->cropImage($img_path,$imgData);
                $this->resize_process($img_path,$imgData);
            }
        }
        return $this->status;
    }

    public function validateTitle($v1){
        if(!empty($v1)){
            return true;
        }else{
            $this->status = 1;
            return false;
        }
    }

    public function validateImage($v1){
        if(strcmp($v1," ") == 0){
            $this->status = 2;
            return false;
        }else{
            return true;
        }
    }
    public function getListImages()
    {
        $sql = 'SELECT * FROM image WHERE  private=0 ORDER BY created_at DESC';
        $result = $this->app['db']->fetchAll($sql);
        $result = $this->checkLikes($result);
        $result = $this->addComments($result);
        return json_encode($result);
    }

    public function getListUserImages(){

        if(isset($_POST['myData'])){
            $id = json_decode($_POST['myData'],true);
            $sql = 'SELECT * FROM image WHERE  user_id=? ORDER BY created_at DESC';
            $result = $this->app['db']->fetchAll($sql,array(
                $id
            ));
            $result = $this->checkLikes($result);
            $result = $this->addComments($result);
            return json_encode($result);
        }
    }

    public function getListPopularImages(){
        $sql = 'SELECT * FROM image WHERE private=? ORDER BY visits DESC';
        $result = $this->app['db']->fetchAll($sql,array(0));
        $result = $this->checkLikes($result);
        $result = $this->addComments($result);
        return json_encode($result);
    }


    function checkLikes($result){

        $id = $this->app['session']->get('id');
        $sql = 'SELECT post_id FROM notification WHERE post_id IN (?) AND user_fired_event=? AND event_id=1';
        $limit = count($result);
        $array = array();
        for($i = 0;$i<$limit;$i++){
           $array[$i] = $result[$i]["id"];
        }
        try{
            $stmt = $this->app['db']->executeQuery($sql,array($array,$id),array(Connection::PARAM_INT_ARRAY));
            $result2 = $stmt->fetchAll();
        }catch(\Exception $exception){
            $exception->getMessage();
        }
        for ($i = 0; $i < count($result); $i++) {
            $result[$i]["liked"] = 0;
            for ($j = 0; $j < count($result2); $j++) {
                if ($result[$i]["id"] == $result2[$j]["post_id"]) {
                    $result[$i]["liked"] = 1;
                    break;
                }
                $result[$i]["liked"] = 0;
            }
        }
        return $result;
    }

    function addComments($result){
        //$query = str_repeat("?,", count($result)-1) . "?";
        $sql = 'SELECT user_id,image_id,text,created_at FROM comment WHERE image_id IN (?) ORDER BY created_at DESC';
        $array = array();
       // $stmt = $db->prepare('SELECT user_id,image_id,text,created_at FROM comment WHERE image_id IN ('.$query.'); ORDER BY created_at DESC');
        $limit = count($result);
        //$j = 0;
        for($i = 0;$i<$limit;$i++){
            $array[$i] = $result[$i]["id"];
          /*  $stmt->bindParam($i, $result[$j]["id"], \PDO::PARAM_STR);
            $j++;*/
        }
        //$stmt->execute();
        //$result2 = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $stmt = $this->app['db']->executeQuery($sql,array($array),array(Connection::PARAM_INT_ARRAY));
        $result2 = $stmt->fetchAll();

        //var_dump($result2);
        if(count($result2) != 0){
           // $query = str_repeat("?,", count($result2)-1) . "?";
            $sql = 'SELECT id,username,img_path FROM user WHERE id IN (?);';
           // $stmt = $db->prepare('SELECT id,username,img_path FROM user WHERE id IN ('.$query.');');
            $limit = count($result2);
            $array = array();
            //$j = 0;
            for($i = 0;$i<$limit;$i++){
                $array[$i] = $result2[$i]["user_id"];
                /*$stmt->bindParam($i, $result2[$j]["user_id"], \PDO::PARAM_STR);
                $j++;*/
            }
            //$stmt->execute();
            //$result3 = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            $stmt = $this->app['db']->executeQuery($sql,array($array),array(Connection::PARAM_INT_ARRAY));
            $result3 = $stmt->fetchAll();
            $commentsList = array();
            for ($i = 0; $i < count($result); $i++) {
                for ($j = 0; $j < count($result2); $j++) {
                    if ($result[$i]["id"] == $result2[$j]["image_id"]) {
                        $commentsContent = array();
                        $resultSearch = $result3[(array_search($result2[$j]["user_id"], array_column($result3,"id")))];
                        array_push($commentsContent,$resultSearch["username"]);
                        array_push($commentsContent,$result2[$j]["text"]);
                        array_push($commentsContent,$resultSearch["img_path"]);
                        array_push($commentsContent,$result2[$j]["created_at"]);
                        array_push($commentsList,$commentsContent);
                    }
                }
                $result[$i]["comments"] = $commentsList;
                $commentsList = array();
            }
        }
        return $result;
    }

    /**
     * Funcio encarregada de crear les imatges en diferents mides
     * @param $img_path
     */
    function resize_process($img_path){
        $aux_path = explode('.',$img_path);
        $new_path = $aux_path[0].'_100.jpg';
        $this->scale(100,$new_path,$img_path);
        $new_path = $aux_path[0].'_400.jpg';
        copy($img_path,$new_path);
        $this->scale(600,$new_path,$img_path);
    }

    function scale($size,$newPath,$originalPath){
        copy($originalPath,$newPath);
        if (($img_info = getimagesize($newPath)) === FALSE)
            die("Image not found or not an image");

        switch ($img_info[2]) {
            case IMAGETYPE_GIF  : $myImage = imagecreatefromgif($newPath);  break;
            case IMAGETYPE_JPEG : $myImage = imagecreatefromjpeg($newPath); break;
            case IMAGETYPE_PNG  : $myImage = imagecreatefrompng($newPath);  break;
            default : die("Unknown filetype");
        }
        $myImage = imagescale($myImage,$size,$size);
        imagejpeg($myImage,$newPath, 100);
    }

    /**
     * Aquesta funcio s'encarrega de retallar la imatge a les mides definides per el usuari i aixi deixarho a escala 1:1
     * @param $img_path
     * @param $imageData
     */
    function cropImage($img_path,$imageData){
        if (($img_info = getimagesize($img_path)) === FALSE)
            die("Image not found or not an image");
        switch ($img_info[2]) {
            case IMAGETYPE_GIF  : $myImage = imagecreatefromgif($img_path);  break;
            case IMAGETYPE_JPEG : $myImage = imagecreatefromjpeg($img_path); break;
            case IMAGETYPE_PNG  : $myImage = imagecreatefrompng($img_path);  break;
            default : die("Unknown filetype");
        }
        $myImage = imagecrop($myImage, ['x' => $imageData["x"], 'y' => $imageData["y"], 'width' => $imageData["width"], 'height' =>  $imageData["height"]]);
        imagejpeg($myImage,$img_path, 100);
    }


    /**
     * Funcion que incrementa y devuelve los likes de una imagen.
     * @return string -> Numero de likes actualizado
     */
    public function newLike(){
        $result = "0";
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            $id = $this->app['session']->get('id');

            try{
                $sql = 'SELECT COUNT(id) FROM notification WHERE user_fired_event=? AND post_id=?';
                $result = $this->app['db']->fetchAll($sql,array(
                    $id,
                    $data->image_id
                ));
                if($result[0]["COUNT(id)"]==0){
                    $likes = $this->app['db']->fetchColumn('SELECT likes FROM image WHERE id=?',array($data->image_id));
                    //var_dump($likes);
                    $likes = intval($likes);
                    $get = $this->app['db']->executeUpdate(
                        'UPDATE image SET likes = likes + 1 WHERE id=?',
                        array($data->image_id)
                    );
                   if($get == 0){

                   }
                    $date = date('Y/m/d H:i:s');
                    $this->app['db']->insert('notification',array(
                        'user_id' => $data->user_id,
                        'user_fired_event' => $id,
                        'event_id' => 1,
                        'post_id' => $data->image_id,
                        'created_at' => $date
                    ));
                }
                $likes = intval(
                    $this->app['db']->fetchColumn('SELECT likes FROM image WHERE id=?',array($data->image_id))
                );
                /*$stmt = $db->prepare('SELECT likes FROM image WHERE id=?;');
                $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
                $stmt->execute();
                $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
            }catch (\Exception $e){
                $likes = $e->getMessage();
            }

        }
        return json_encode(/*$result*/array(array('likes'=>$likes)));
    }

    public function dislike(){
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            $id = $this->app['session']->get('id');
            $sql = 'SELECT COUNT(id) FROM notification WHERE user_fired_event=? AND post_id=?';
            $result = $this->app['db']->fetchAll($sql,array(
                $id,
                $data->image_id
            ));
            /*$db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT COUNT(id) FROM notification WHERE user_fired_event=? AND post_id=?;');
            $stmt->bindParam(1,$id, \PDO::PARAM_STR);
            $stmt->bindParam(2,$data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
            if($result[0]["COUNT(id)"]!=0){
                $likes = intval(
                    $this->app['db']->fetchColumn('SELECT likes FROM image WHERE id=?',array(
                        $data->image_id
                    ))
                );
                $get = $this->app['db']->executeUpdate(
                    'UPDATE image SET likes = likes - 1 WHERE id=?',
                    array($data->image_id)
                );
                if($get == 0){
                    
                }
               /* $stmt = $db->prepare('UPDATE image SET likes = likes - 1 WHERE id=?;');
                $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
                $stmt->execute();*/
                $this->app['db']->delete('notification',
                    array(
                        'user_fired_event' => $id,
                        'post_id' => $data->image_id
                    ));

               /* $stmt = $db->prepare('DELETE FROM notification WHERE user_fired_event=? AND post_id=?;');
                $stmt->bindParam(1, $id, \PDO::PARAM_STR);
                $stmt->bindParam(2, $data->image_id, \PDO::PARAM_STR);
                $stmt->execute();*/
            }
            $likes = intval(
                $this->app['db']->fetchColumn(
                    'SELECT likes FROM image WHERE id=?',
                    array(
                        $data->image_id
                    )
                )
            );
            /*$stmt = $db->prepare('SELECT likes FROM image WHERE id=?;');
            $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
        }
        return json_encode(array(array('likes'=>$likes)));
    }

    public function getInfoUnicImage(){
        if(isset($_POST['id'])) {
            $this->app['db']->executeUpdate(
                'UPDATE image SET visits = visits +1 WHERE id = ?',
                array(
                    $_POST['id']
                )
            );

            $result = $this->app['db']->fetchAll(
                'SELECT * FROM image WHERE id=?',
                array(
                    $_POST['id']
                )
            );
           /* $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT * FROM image WHERE id=?;');
            $stmt->bindParam(1, $_POST['id'], \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);*/
            $result = $this->addComments($result);
            $result = $this->checkLikes($result);
            return json_encode($result);
        }
        return 0;
    }

    public function dropImage(){
        if(isset($_POST['id'])&&isset($_POST['path'])) {
            $aux = explode('.',$_POST['path']);
            $path1= $_POST['path'];
            $path2= $aux[0].'_100.jpg';
            $path3= $aux[0].'_400.jpg';

            if(unlink($path1) && unlink($path2) && unlink($path3)){
                $this->app['db']->delete('image',array('id' => $_POST['id']));
                $this->app['db']->delete('comment',array('id' => $_POST['id']));
                $this->app['db']->delete('notification',array('id' => $_POST['id']));
                /*$db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                $stmt = $db->prepare('DELETE FROM image WHERE id=?;');
                $stmt->bindParam(1, $_POST['id'], \PDO::PARAM_STR);
                $stmt->execute();

                $stmt = $db->prepare('DELETE FROM comment WHERE image_id=?;');
                $stmt->bindParam(1, $_POST['id'], \PDO::PARAM_STR);
                $stmt->execute();

                $stmt = $db->prepare('DELETE FROM notification WHERE post_id=?;');
                $stmt->bindParam(1, $_POST['id'], \PDO::PARAM_STR);
                $stmt->execute();*/
                return 1;
            }
        }
        return 0;
    }

    public function editImage(){
        $array = array();
        if(isset($_POST['myData'])){
            $info = json_decode($_POST['myData']);
            if($this->validateTitle($info->title)) {
                $state=0;
                if ($info->private == true) {
                    $state=1;
                }
                $done = $this->app['db']->executeUpdate(
                    'UPDATE image SET title = ?, private = ? WHERE id = ?',
                    array(
                        $info->title,
                        $state,
                        $info->id_image
                    )
                );
                if($done != 0){
                    $userID = $this->app['db']->fetchColumn(
                        'SELECT user_id FROM image WHERE id = ?',
                        array($info->id_image)
                    );
                    $username = $this->app['db']->fetchColumn(
                        'SELECT username FROM user WHERE id = ?',
                        array($userID)
                    );
                    $array['result'] = 2;
                    $array['username'] = $username;
                    return json_encode($array);
                }

            }
            return json_encode($array['result'] = 1);

        }
        return json_encode($array['result'] = 0);
    }
}