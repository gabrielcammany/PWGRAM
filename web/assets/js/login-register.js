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
        $('.modal-title').html('Creación de cuenta');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Iniciar sesión');
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
    var stringData = JSON.stringify(reg)
    $.ajax({
        type: 'post',
        url: '/signin',
        data: {myData:stringData},
        success: function ($response) {
            //console.log($response);
            $response = JSON.parse($response);
            user_logged = $response;
            status = $response.status;
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
    if(validaUsername($('#username').val())&&validaEmail($('#email_reg').val())&&validateDate($('#datepicker').val())&&validatePasswordRegistration($('#password_reg').val(),$('#password_confirmation').val())){

        var reg = {};
        reg.email = $('#email_reg').val();
        reg.pass = $('#password_reg').val();
        reg.date = $('#datepicker').val();
        reg.confirm_pass = $('#password_confirmation').val();
        // $('#password').append('<h3>hola tete</h3>')
        reg.username = $('#username').val();
        if(img_path)reg.img = 1;
        if(!img_path)reg.img = 0;
        var stringData = JSON.stringify(reg);
        $.ajax({
            type: 'post',
            url: '/signup',
            data: {myData:stringData},
            success: function ($response) {
                //Determinar resposta server
                status_modal($response);
                //Evitar que es faci shake quan es registra.
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

function validaEmail(v1){
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
    if(!validaEmail(v1)) {
        if (usernameRegex.test(v1) && v1.length <= 20) {
            return true;
        } else {
            status = 4;
            return false;
        }
    }

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
    switch($response){
        case '1':
            uploadPicture();
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
            var anchor = document.getElementById('userNameDropdown');
            anchor.innerHTML += user_logged.username;
            $('#userDropdown').show(); //Per alguna rao si utilitzes el anchor d'abans no et fa el show correctament, aixi que s'ha de tornar a demanar
            break;
        case'11':
            $('.error').addClass('alert alert-danger').html("Email o contraseña incorrecta");
            break;
        case'12':
            $('.error').addClass('alert alert-danger').html("Username o contrasena incorrecta");
        default:
            $('.error').addClass('alert alert-danger').html("Error desconocido" + $response);
    }
}


function uploadPicture() {
    $.ajax({
        type: 'POST',
        url: '/upload',
        data: {myData:$('#perfil_reg').attr('src')},
        success: function ($response) {
        }
    });
}

/*
Funció que espera a que el usuari realitzi algun canvi en el input per poder cridar a la funció encarregada
de realitzar el canvi de la imatge de defecte per la seleccionada.
 */
$("#btnSelectImage").change(function(){
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function (e) {
            $('#perfil_reg').attr('src', e.target.result);
        }
    }
    img_path=1;
});


