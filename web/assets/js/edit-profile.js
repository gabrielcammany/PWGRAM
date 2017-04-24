/**
 * Created by Xps_Sam on 19/04/2017.
 */

var user_info;
$(function() {
    user_info = JSON.parse(localStorage.getItem('user'));
   // console.log(user_info);
    $('#perfil_reg').attr('src','../'+user_info.img_path);
    $('#email_reg').attr('value',user_info.email);
    $('#username').attr('value',user_info.username);
   // console.log(user_info.birthdate.replace(/-/g , "/"));
    $('#datepicker').attr('value',user_info.birthdate.replace(/-/g , "/"));
    $('#password_reg').attr('value',user_info.password);
    $('#password_confirmation').attr('value',user_info.password);
});

$('#update_info').click(function (e) {
    e.preventDefault();

    if(validaUsername($('#username').val())&&validaEmail($('#email_reg').val())&&validateDate($('#datepicker').val())&&validatePasswordRegistration($('#password_reg').val(),$('#password_confirmation').val())){
        console.log('@@ ');
        var reg = {};
        reg.email = $('#email_reg').val();
        reg.pass = $('#password_reg').val();
        reg.date = $('#datepicker').val();
        reg.confirm_pass = $('#password_confirmation').val();
        reg.username = $('#username').val();
        if(img_path)reg.img = 1;
        if(!img_path)reg.img = 0;
        //console.log('--> '+reg.img+'\n');
        var stringData = JSON.stringify(reg);
        //console.log("LLEGOO ANTES AJAX");
        $.ajax({
            type: 'post',
            url: '/update',
            data: {myData:stringData,oldUser:user_info.username},
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


function validaEmail(v1){
    console.log('## '+v1);
    var usernameRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(usernameRegex.test(v1)){
        return true;
    }else{
        status=3;
        return false;
    }

}

function validaUsername(v1){
    var usernameRegex = /^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
    //if(!validaEmail(v1)) {

        if (usernameRegex.test(v1) && v1.length <= 20) {
            return true;
        } else {
            status = 4;
            return false;
        }
    //}

}
function validatePassword(v1){

    if (v1.length < 6) {
        status=7;
        return false;
    }
    if (v1.search(/[a-z]/i) < 0) {
        status=7;
        return false;
    }
    if (v1.search(/[A-Z]/i) < 0) {
        status=7;
        return false;
    }
    if (v1.search(/[0-9]/) < 0) {
        status=7;
        return false;
    }
    return true;
}


function validateDate(dateString){
    var regEx = /(\d{4})[-\/](\d{2})[-\/](\d{2})/;
    var n = new Date();
    var year = n.getFullYear();
    var array_date = dateString.split("/");

    if(regEx.test(dateString) && array_date[0] <= year && array_date[1] <= 12 && array_date[2] <= daysInMonth(array_date[1],array_date[0])){
        return true;
    }else{
        status=5;
        return false;
    }
}

function daysInMonth(month,year){
    return new Date(year,month,0).getDate();
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
    console.log('ERROR--> '+$response);
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

            $('#login_home').hide();
            $('#close_modal').click();

            $('.main_profile').css('display','block');
            $('#img_profile').attr('src',user_logged.img_path);
            $('h3').html(user_logged.username);
            localStorage.setItem('user', JSON.stringify(user_logged));
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
