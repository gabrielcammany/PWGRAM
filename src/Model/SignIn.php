<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 17/04/2017
 * Time: 18:37
 */

namespace PwGram\Model;

use PHPMailer;

class SignIn
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

    public function signIn()
    {
        $json = json_decode($_POST['myData']);
        $i = 0;
        $email = "";
        $password = "";
        $username = "";
        $result = array();
        foreach ($json as $key => $value) {
            if (!is_array($value)) {
                switch ($i) {
                    case 0:
                        $email = $value;
                        break;
                    case 1:
                        $username = $value;
                        break;
                    case 2:
                        $password = $value;
                        break;
                }
                $i++;
            }
        }
        /*
         * Nos aseguramos de realizar el inicio de sesion con el email o username
         */
        if (($this->validaEmail($email) || $this->validaUsername($username))) {
            $result = $this->app['db']->fetchAssoc(
                'SELECT * FROM user WHERE (email = ? OR username = ?)',
                array(
                    $email,
                    $username
                )
            );
            if($result['active'] != 0) {

                if (sizeof($result['id']) == 0 || !password_verify($password, $result['password'])) {
                    $this->status = 11;

                } else {

                    $this->app['session']->set('id', $result['id']);
                    $this->app['session']->set('username', $result['username']);
                    $this->app['session']->set('posts', $result['posts']);
                    $this->app['session']->set('img', $result['img_path']);
                    $this->status = 10;
                    $generator = new Random();
                    $token = $generator->generate(36);
                    setcookie("id_s", $token, time() + 2592000);
                    $get = $this->app['db']->executeUpdate(
                        'UPDATE user SET sessionID=? WHERE (email=? OR username=?)',
                        array(
                            $token,
                            $email,
                            $username
                        )
                    );
                    if ($get == 0) {
                        $this->status = 11;
                    }

                }
            }else{
                $this->status = 13;
            }
        }
        $result["status"] = $this->status;
        return json_encode($result);
    }

    public function validaEmail($v1){
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

    public function validatePassword($v1){

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

