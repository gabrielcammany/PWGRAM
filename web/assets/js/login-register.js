/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */

var status =0;

var img_path=0;
var user_logged= new Object();

$(function () {
    $('#loginModal').modal('hide');
});
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function log_in( email, username, password){
    var reg = {};
    reg.email = email;
    reg.username = username;
    reg.pass = password;
    var stringData = JSON.stringify(reg);
    $.ajax({
        type: 'post',
        url: '/signin',
        data: {myData:stringData},
        success: function ($response) {
            console.log($response);
            try{

                user_logged=JSON.parse($response);
            }

            catch(e){
                status=$response;

            }
            status=$response;

            if($response[0]=='{'){
                console.log('hola tete '+status);
                status=10;
                status_modal(''+status+'');
                $('#login_home').hide();
                $('#close_modal').click();

                $('.main_profile').css('display','block');
                $('#img_profile').attr('src',user_logged.img_path);
                //Forzamos k la primera letra sea mayuscula
                user_logged.username = user_logged.username.charAt(0).toUpperCase()+user_logged.username.slice(1);
                $('h3').html(user_logged.username);
            }
            status_modal(''+status+'');
            shakeModal();
            return 10;
        }
    });
}
$('#login_submit').click(function (e){
    e.preventDefault();
    if((validaEmail($('#email').val())||validaUsername($('#email').val()))&&validatePassword($('#password').val())){

        if(validaEmail($('#email').val())){
            log_in($('#email').val(),' ',$('#password').val());
        }else{
            log_in(' ',$('#email').val(),$('#password').val());
        }

    }else{
        status_modal(''+status+'');
        shakeModal();
    }
});

$('#registerUser').click(function(e){
    e.preventDefault();
    if(validaEmail($('#email_reg').val())&&validaUsername($('#username').val())&&validatePasswordRegistration($('#password_reg').val(),$('#password_confirmation').val())&&validateDate($('#date').val())){

        var reg = {};
        reg.email = $('#email_reg').val();
        reg.pass = $('#password_reg').val();
        reg.date = $('#date').val();
        reg.confirm_pass = $('#password_confirmation').val();
        $('#password').append('<h3>hola tete</h3>')
        reg.username = $('#username').val();
        if(img_path)reg.img = 1;
        if(!img_path)reg.img = 0;
        //console.log('--> '+reg.img+'\n');
        var stringData = JSON.stringify(reg);
        //console.log("LLEGOO ANTES AJAX");
        $.ajax({
            type: 'post',
            url: '/signup',
            data: {myData:stringData},
            success: function ($response) {
                //Determinar resposta server
                status_modal($response);
                //Evitar que es fasci shake quan es registra.
                if($response!=1)shakeModalRegistration();
            }
        });
    }else{
        status_modal(''+status+'');
        shakeModalRegistration();
    }

});

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
}
function shakeModalRegistration(){
    $('#loginModal .modal-dialog').addClass('shake');
    //$('.error').addClass('alert alert-danger').html("Invalid information combination");
    setTimeout( function(){
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000 );
}

$('#login_home').click(function (e) {
    e.preventDefault();
    openLoginModal();
});

function validaEmail($v1){
    var usernameRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(usernameRegex.test($v1)){
        return true;
    }else{
        status=3;
        return false;
    }

}

function validaUsername($v1){
    var usernameRegex = /^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
    if(usernameRegex.test($v1)){
        return true;
    }else{
        status=5;
        return false;
    }

}
function validatePassword($v1){

    if ($v1.length < 6) {
        status=7;
        return false;
    }
    if ($v1.search(/[a-z]/i) < 0) {
        status=7;
        return false;
    }
    if ($v1.search(/[A-Z]/i) < 0) {
        status=7;
        return false;
    }
    if ($v1.search(/[0-9]/) < 0) {
        status=7;
        return false;
    }
    return true;
}
function validateDate(dateString){
    var regEx = /(\d{4})[-\/](\d{2})[-\/](\d{2})/
    if(regEx.test(dateString)){
        return true;
    }else{

        status=5;
        return false;
    }
}


function validatePasswordRegistration($v1,$v2){

    if($v1!=$v2){
        status=6;
        return false;
    }
    if ($v1.length < 6) {
        status=7;

        return false;
    }
    if ($v1.search(/[a-z]/i) < 0) {
        status=7;

        return false;
    }
    if ($v1.search(/[A-Z]/i) < 0) {
        status=7;

        return false;
    }

    if ($v1.search(/[0-9]/) < 0) {
        status=7;

        return false;
    }
    return true;
}
/*
    Funcio que ens permetra tenir un codi d'errors igual per el client com per el servidor.
 */
function status_modal( $response){
    switch($response){
        case '1':
            swal({
                title: "Registrado",
                type: "success",
                timer:2000,
                showConfirmButton: false
            });
            log_in(' ',$('#username').val(),$('#password_reg').val())
            break;
        case '2':
            $('.error').addClass('alert alert-danger').html("Usuario existente");
            break;
        case '3':
            $('.error').addClass('alert alert-danger').html("Formato de email incorrecto");
            break;
        case '4':
            $('.error').addClass('alert alert-danger').html("Formato del nombre de usuario");
            break;
        case '5':
            $('.error').addClass('alert alert-danger').html("Formato de fecha incorrecto");
            break;
        case '6':
            $('.error').addClass('alert alert-danger').html("Los password no son iguales");
            break;
        case '7':
            $('.error').addClass('alert alert-danger').html("Formato de password incorrecto");
            break;
        case '8':
            $('.error').addClass('alert alert-danger').html("Imagen no subida");
            break;

        case '10':
            swal({
                title: "Logged",
                type: "success",
                timer:2000,
                showConfirmButton: false
            });
            break;
        case'11':
            $('.error').addClass('alert alert-danger').html("Email o contrasena incorrecta");
            break;
        case'12':
            $('.error').addClass('alert alert-danger').html("Username o contrasena incorrecta");
        default:
            $('.error').addClass('alert alert-danger').html("Error desconocido");
    }
}

/*
    Funció encarregada de llegir la url introduida per l'usuari i carregar la foto de perfil seleccionada
*/
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            $('#perfil_reg').attr('src', e.target.result);
            /*
            Enviamos la imagen desde el cliente al servidor con un nombre provisional y solo cambiaremos el nombre
            al registrar al usuario.
             */
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: {myData:$('#perfil_reg').attr('src')},
                success: function ($response) {
                    console.log('**'+$response);
                }
            });
        }

    }
}
/*
Funció que espera a que el usuari realitzi algun canvi en el input per poder cridar a la funció encarregada
de realitzar el canvi de la imatge de defecte per la seleccionada.
 */
$("#btnSelectImage").change(function(){
    readURL(this);
    img_path=1;
});