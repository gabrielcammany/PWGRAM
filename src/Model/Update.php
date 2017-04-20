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

    public function __construct($request)
    {
        $this->request = $request;
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
                    }
                    $i++;
                }

            }
            if(isset($_POST['oldUser'])) {
                $username_old =$_POST['oldUser'];
            }
            $db = new \PDO('mysql:host=localhost;dbname=pwgram', "homestead", "secret");
            $vResult = $this->validation_user($db,$username);
            if(!$vResult){

                if($this->validaEmail($email)&&$this->validateDate($date)&&$this->validatePasswordRegistration($pass,$confirm_pass)){

                    $img_path='assets/img/uploads/user_'.$username.'.jpg';
                    if($img==1){
                        $valid_path = rename('assets/img/uploads/preview.jpg',$img_path);
                    }else{
                        $valid_path = copy('assets/img/default/default_user.png',$img_path);
                    }
                    if($valid_path){
                        $stmt = $db->prepare('UPDATE user SET email=?,password=?,birthdate=?,username=?,img_path=?,active=1 WHERE username="'.$username_old.'"');
                        $stmt->bindParam(1, $email, \PDO::PARAM_STR);
                        $stmt->bindParam(2, $pass, \PDO::PARAM_STR);
                        $stmt->bindParam(3, $date, \PDO::PARAM_STR);
                        $stmt->bindParam(4, $username, \PDO::PARAM_STR);
                        $stmt->bindParam(5, $img_path, \PDO::PARAM_STR);
                        $error = $stmt->execute();
                        $this->status = 1;
                    }else{
                        $this->status=8;
                    }
                }
            }
        }
        return $this->status;
    }

    function validation_user($db,$v1){
        $stmt = $db->prepare('SELECT * FROM user WHERE username=?');
        $stmt->bindParam(1,$v1,\PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        if(sizeof($result['id'])== 0) {

            return 0;
        }
        $this->status = 2;//el usuario si existe
        return 1;

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