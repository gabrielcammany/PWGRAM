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
        if (!empty($_POST['myData'])) {
            $img_data=$_POST['myData'];
            $this->base64_to_jpeg($img_data, '/assets/img/tmp/'.$this->app['session']->get('username').'jpg');
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
                $img_path = '../assets/img/users/'.$username.'/'.str_replace("/","-",$date).'.jpg';
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

        if(isset($_POST['myData'])){
            $data = json_decode($_POST['myData'],true);

        }
    }


}