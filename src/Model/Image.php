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
            //$public = $data['public'];
            $username = $data['username'];
            $id = $data['userID'];

            if($private){
                $tinyint = 1;
            }else{
                $tinyint = 0;
            }

            if($this->validateImage($img) && $this->validateTitle($title)) {

                //date_default_timezone_set('Europe/Spain');
                $date = date('Y/m/d H:i:s');
                $img_path = 'assets/img/users/'.$username.'/'.str_replace("/","-",$date).'.jpg';
                $img_path = str_replace(" ","_",$img_path);
                $this->base64_to_jpeg($img, $img_path);
                $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
                //$db = new PDO('mysql:host=localhost;dbname=pwgram', "homestead", "secret");
                $stmt = $db->prepare('INSERT INTO image (user_id,title,img_path,visits,private,created_at) VALUES (?,?,?,0,?,?)');
                $stmt->bindParam(1, $id, \PDO::PARAM_STR);
                $stmt->bindParam(2, $title, \PDO::PARAM_STR);
                $stmt->bindParam(3, $img_path, \PDO::PARAM_STR);
                $stmt->bindParam(4, $tinyint, \PDO::PARAM_STR);
                $stmt->bindParam(5, $date, \PDO::PARAM_STR);
                $stmt->execute();
                $this->status = 3;

                $this->resize_process($img_path,400);
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
        if(strcmp($v1,"../assets/img/default/default_user.png") == 0){
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
     * @param $tamany
     */
    function resize_process($img_path,$tamany){
        $aux_path = explode('.',$img_path);
        $new_path = $aux_path[0].'_100.jpg';
        copy($img_path,$new_path);
        $this->resize_image($new_path,100);
        $new_path = $aux_path[0].'_400.jpg';
        copy($img_path,$new_path);
        $this->resize_image($new_path,400);
    }

    function resize_image($img_path,$tamany) {

        list($width, $height) = getimagesize($img_path);
        $myImage = imagecreatefromjpeg($img_path);

        if ($width > $height) {
            $y = 0;
            $x = ($width - $height) / 2;
            $smallestSide = $height;
        } else {
            $x = 0;
            $y = ($height - $width) / 2;
            $smallestSide = $width;
        }

        $thumbSize = $tamany;
        $thumb = imagecreatetruecolor($thumbSize, $thumbSize);
        imagecopyresampled($thumb, $myImage, 0, 0, $x, $y, $thumbSize, $thumbSize, $smallestSide, $smallestSide);

        header('Content-type: image/jpeg');
        imagejpeg($thumb,$img_path, 100);
    }

    /**
     * Funcion que incrementa y devuelve los likes de una imagen.
     * @return string -> Numero de likes actualizado
     */
    function newLike(){
        if(isset($_POST['path'])) {
            $path = $_POST['path'];
            $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");

            $stmt = $db->prepare('UPDATE image SET likes = likes + 1 WHERE img_path=?');

            $stmt->bindParam(1, $path, \PDO::PARAM_STR);
            $stmt->execute();
           // return 1;
            $stmt = $db->prepare('SELECT likes FROM image WHERE img_path=?');
            $stmt->bindParam(1, $path, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return json_encode($result);
        }
    }

    function dislike(){

        if(isset($_POST['path'])) {
            $path = $_POST['path'];
            $db = new PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");

            $stmt = $db->prepare('UPDATE image SET likes = likes - 1 WHERE img_path=?');

            $stmt->bindParam(1, $path, \PDO::PARAM_STR);
            $stmt->execute();
            // return 1;
            $stmt = $db->prepare('SELECT likes FROM image WHERE img_path=?');
            $stmt->bindParam(1, $path, \PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return json_encode($result);
        }
    }


}