<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 12/04/2017
 * Time: 13:42
 */

namespace PwGram\Model;

use PwGram\Model;

class SignUp
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

    public function registerUser(){

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

            $db = new \PDO('mysql:host=localhost;dbname=pwgram', "root", "gabriel");
            //$db = new \PDO('mysql:host=localhost;dbname=pwgram', "homestead", "secret");
            $vResult = $this->validation_user($db,$username);

            if(!$vResult){

                if($this->validaEmail($email)&&$this->validateDate($date)&&$this->validatePasswordRegistration($pass,$confirm_pass)){
                    //if($this->uploadFile($img)) {
                    $img_path='assets/img/tmp/'.$username.'.jpg';
                    $this->app['session']->set('username',$username);
                    $hashed_pass = password_hash($pass, PASSWORD_DEFAULT);
                    $stmt = $db->prepare('INSERT INTO user(email,password,birthdate,username,img_path,active) values(?,?,?,?,?,0)');
                    $stmt->bindParam(1, $email, \PDO::PARAM_STR);
                    $stmt->bindParam(2, $hashed_pass, \PDO::PARAM_STR);
                    $stmt->bindParam(3, $date, \PDO::PARAM_STR);
                    $stmt->bindParam(4, $username, \PDO::PARAM_STR);
                    $stmt->bindParam(5, $img_path, \PDO::PARAM_STR);
                    $stmt->execute();
                    $this->status = 1;
                    $this->sendEmail($email,$username);
                }
            }
            return $this->status;
        }
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

    function validaUsername($v1){
        if(preg_match('/^[a-zA-Z0-9]{20,}$/', $v1)) {
            return true;
        }
        $this->status = 4;//formato de nombre del usuario incorrecto
        return false;
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

    public function sendEmail($email,$username){
        date_default_timezone_set('Etc/UTC');
        $token = md5($email.$username."b2891fceefe96e96c97d7b7a014fe2eb");
        //Create a new PHPMailer instance
        $mail = new \PHPMailer;
        //Tell PHPMailer to use SMTP
        $mail->isSMTP();
        //Enable SMTP debugging
        // 0 = off (for production use)
        // 1 = client messages
        // 2 = client and server messages
        $mail->SMTPDebug = 0;
        //Ask for HTML-friendly debug output
        $mail->Debugoutput = 'html';
        //Set the hostname of the mail server
        $mail->Host = 'smtp.gmail.com';
        // use
        // $mail->Host = gethostbyname('smtp.gmail.com');
        // if your network does not support SMTP over IPv6
        //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
        $mail->Port = 587;
        //Set the encryption system to use - ssl (deprecated) or tls
        $mail->SMTPSecure = 'tls';
        //Whether to use SMTP authentication
        $mail->SMTPAuth = true;
        //Username to use for SMTP authentication - use full email address for gmail
        $mail->Username = "lenam96mmg@gmail.com";
        //Password to use for SMTP authentication
        $mail->Password = "mMg151296961215";
        //Set who the message is to be sent from
        $mail->setFrom('no-reply@pwgram.com', 'Equipo de PWGram');
        //Set an alternative reply-to address
        //$mail->addReplyTo('replyto@example.com', 'First Last');
        //Set who the message is to be sent to
        $mail->addAddress($email, $username);
        //Set the subject line
        $mail->Subject = 'Bienvenido a PwGram '.$username.'!';
        //Read an HTML message body from an external file, convert referenced images to embedded,
        //convert HTML into a basic plain-text alternative body
        //Replace the plain text body with one created manually
        $file = file_get_contents('assets/html/emailBody.html', true);
        $mail->Body = str_replace("%BtnURL%","http://instagram.dev/validate/".$username."/".$token,str_replace("%UserName%",$username,$file));
        $mail->IsHTML(true);
        //send the message, check for errors
        if (!$mail->send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }
    }


    }
