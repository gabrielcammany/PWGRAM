<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 19/04/2017
 * Time: 19:31
 */

namespace PwGram\Model;


class Update
{
    private $request;
    private $status=0;
    private $imgClass;
    private $app;

    public function __construct($app,$request,Image $imageClass)
    {
        $this->app = $app;
        $this->request = $request;
        $this->imgClass = $imageClass;
        return $this;
    }

    public function updateUser(){
        if(isset($_POST['myData'])) {
            $json = json_decode($_POST['myData']);
            $i = 0;
            foreach ($json as $key => $value) {
                if (!is_array($value)) {
                    switch ($i) {
                        case 0:
                            $email = $value;
                            break;
                        case 1:
                            $pass = $value;
                            break;
                        case 2:
                            $date = $value;

                            break;
                        case 3:
                            $confirm_pass = $value;

                            break;
                        case 4:
                            $username = $value;
                            break;
                        case 5:
                            $img = $value;
                            break;
                        case 6:
                            $id = $value;
                            break;
                    }
                    $i++;
                }

            }

            if($this->validaUsername($username)&&$this->validaEmail($email)&&$this->validateDate($date)&&$this->validatePasswordRegistration($pass,$confirm_pass)){
                $img_path= 'assets/img/users/'.strtolower($username).'/profileImage.jpg';
                if(strcmp('../assets/img/users/'.strtolower($username).'/profileImage_100.jpg',$img) != 0){
                    $this->imgClass->base64_to_jpeg($img, $img_path);
                    $this->imgClass->resize_process($img_path);
                }

                $sql = "SELECT password FROM user WHERE id=?";
                $get = $this->app['db']->fetchAssoc($sql,array($id));
                if(!$get){
                     $this->status = 2;
                }else {

                    if (empty($pass) && empty($confirm_pass)) {
                        $sql = "UPDATE user SET email=?,password=?,birthdate=?,username=?,img_path=?,password=? WHERE id=?";
                        $get = $this->app['db']->executeUpdate($sql, array($email, $pass, $date, $username, $img_path,$get['password'], $id));
                        if($get == 0){
                            $this->status =2;
                        }
                    } else {
                        $hashed_pass = password_hash($pass, PASSWORD_DEFAULT);
                        $sql = "UPDATE user SET email=?,password=?,birthdate=?,username=?,img_path=?,password=? WHERE id=?";
                        $get = $this->app['db']->executeUpdate($sql, array($email, $pass, $date, $username, $img_path, $hashed_pass, $id));
                        if($get == 0){
                            $this->status = 2;
                        }
                    }
                    $this->status = 1;
                }
            }

        }
        return $this->status;
    }

    function validaEmail($v1){
        if(filter_var($v1,FILTER_VALIDATE_EMAIL)){
            return true;
        }else{
            $this->status = 3;//formato de email incorrecto
            return false;
        }
    }

    public function validaUsername($v1){
        $longitud = strlen($v1);

        if(!ctype_alnum($v1) && $longitud > 20) {
            $this->status = 4;//formato de nombre del usuario incorrecto
            return false;
        }
        return true;
    }

    function validateDate($v1){
        $date = explode('/',$v1);
        if(checkdate($date[1],$date[0],$date[2])){
            $this->status = 5;//fecha incorrecta;
            return false;
        }else{

            return true;
        }
    }

    function validatePasswordRegistration($v1,$v2){

        if(empty($v1) && empty($v2))return true;

        if($v1!=$v2){

            $this->status = 6;//La contraseña de confirmacion no coincide
            return false;
        }
        if (strlen($v1) < 6 || strlen($v1) > 12 ) {
            $this->status = 7;//contraseña incorrecta

            return false;
        }
        if (!preg_match("#[a-z]+#",$v1)) {
            $this->status = 7;//contraseña incorrecta

            return false;
        }
        if (!preg_match("#[A-Z]+#",$v1)) {
            $this->status = 7;//contraseña incorrecta

            return false;
        }

        if (!preg_match("#[0-9]+#",$v1)) {
            $this->status = 7;//contraseña incorrecta

            return false;
        }
        return true;
    }
}