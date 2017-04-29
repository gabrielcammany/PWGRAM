<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 16/04/2017
 * Time: 19:20
 */

namespace PwGram\Model;


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
        $success = array();
        // echo ($_POST['myData']);
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
                $img_path = 'assets/img/users/'.$this->app['session']->get('username').'/'.str_replace("/","-",$date).'.jpg';
                $img_path = str_replace(" ","_",$img_path);
                $this->base64_to_jpeg($img, $img_path);
                $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                $stmt = $db->prepare('INSERT INTO image (user_id,title,img_path,visits,private,created_at) VALUES (?,?,?,0,?,?)');
                $stmt->bindParam(1, $id , \PDO::PARAM_STR);
                $stmt->bindParam(2, $title, \PDO::PARAM_STR);
                $stmt->bindParam(3, $img_path, \PDO::PARAM_STR);
                $stmt->bindParam(4, $tinyint, \PDO::PARAM_STR);
                $stmt->bindParam(5, $date, \PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $db->prepare('UPDATE user SET posts=posts+1 WHERE id=?');
                $stmt->bindParam(1, $id, \PDO::PARAM_STR);
                $stmt->execute();
                $this->status = 3;
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
    public function getListImages(){

        $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");

        $stmt = $db->prepare('SELECT * FROM image WHERE  private=0 ORDER BY created_at DESC');
        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return json_encode($result);
    }

    public function getListUserImages(){

        if(isset($_POST['myData'])){
            $id = json_decode($_POST['myData'],true);
            $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");

            $stmt = $db->prepare('SELECT * FROM image WHERE  user_id=? ORDER BY created_at DESC');
            $stmt->bindParam(1, $id, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            return json_encode($result);
        }
    }

    public function getListPopularImages(){
        $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");

        $stmt = $db->prepare('SELECT * FROM image WHERE private=0 ORDER BY visits DESC');

        $stmt->execute();
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return json_encode($result);
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
        $new_path = $aux_path[0].'_600.jpg';
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
        $result = 'no hay datos';
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            try{
                $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                $stmt = $db->prepare('UPDATE image SET likes = likes + 1 WHERE id=?;');
                $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
                $stmt->execute();
                $date = date('Y/m/d H:i:s');
                $stmt = $db->prepare('INSERT INTO notification(user_id,user_fired_event,event_id,post_id,created_at) values(?,?,1,?,?);');
                $stmt->bindParam(1, $data->user_id, \PDO::PARAM_STR);
                $stmt->bindParam(2, $this->app['session']->get('id'), \PDO::PARAM_STR);
                $stmt->bindParam(3, $data->image_id, \PDO::PARAM_STR);
                $stmt->bindParam(4, $date, \PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $db->prepare('SELECT likes FROM image WHERE id=?;');
                $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
                $stmt->execute();
                $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }catch (\Exception $e){
                $result = $e->getMessage();
            }

        }
        return json_encode($result);
    }

    public function dislike(){
        if(!empty($_POST['data'])) {
            $data = json_decode($_POST['data']);
            $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('UPDATE image SET likes = likes - 1 WHERE id=?;');
            $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $stmt = $db->prepare('DELETE FROM notification WHERE user_fired_event=? AND post_id=?;');
            $stmt->bindParam(1, $this->app['session']->get('id'), \PDO::PARAM_STR);
            $stmt->bindParam(2, $data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $stmt = $db->prepare('SELECT likes FROM image WHERE id=?;');
            $stmt->bindParam(1, $data->image_id, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }
        return json_encode($result);
    }

    public function getInfoUnicImage(){
        if(isset($_POST['id'])) {
            $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            $stmt = $db->prepare('SELECT * FROM image WHERE id=?;');
            $stmt->bindParam(1, $_POST['id'], \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            return json_encode($result);
        }
        return 0;
    }
}