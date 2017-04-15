/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */

var status =0;

var img_path=" ";

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

function loginAjax(){
    /*   Remove this comments when moving to server
    $.post( "/login", function( data ) {
            if(data == 1){
                window.location.replace("/home");            
            } else {
                 shakeModal(); 
            }
        });
    */
    if(validaEmail($('#email').val())&&validaUsername($('#username').val())&&validatePassword($('#password').val())){
        console.log('Todo OK!');
    }else{
        shakeModal();
    }
/*   Simulate error message from the server   */
     //shakeModal();
}
$('#registerUser').click(function(e){
    e.preventDefault();
    if(validaEmail($('#email_reg').val())&&validaUsername($('#username').val())&&validatePasswordRegistration($('#password_reg').val(),$('#password_confirmation').val())&&validateDate($('#date').val())){

        var reg = {};
        reg.email = $('#email_reg').val();
        reg.pass = $('#password_reg').val();
        reg.date = $('#date').val();
        reg.confirm_pass = $('#password_confirmation').val();
        reg.username = $('#username').val();
        reg.img = img_path;
        var stringData = JSON.stringify(reg);
        //console.log("LLEGOO ANTES AJAX");
        $.ajax({
            type: 'post',
            url: '/signup',
            data: {myData:stringData},
            success: function ($response) {

                error_modal($response);
                shakeModalRegistration();
            }
        });
    }else{
        error_modal(''+status+'');
        shakeModalRegistration();
    }

});

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
            // $('input[type="password"]').val('');
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

    return false;
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

function error_modal( $response){
    switch($response){
        case '1':
            swal({
                title: "Registrado",
                type: "success",
                timer:2000,
                showConfirmButton: false
            });
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
    }
}

/*
    Funció encarregada de llegir la url introduida per l'usuari i carregar la foto de perfil seleccionada
*/
function readURL(input) {
    console.log('adios tete');
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#perfil_reg').attr('src', e.target.result);
            img_path=e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}
/*
Funció que espera a que el usuari realitzi algun canvi en el input per poder cridar a la funció encarregada
de realitzar el canvi de la imatge de defecte per la seleccionada.
 */
$("#btnSelectImage").change(function(){
    readURL(this);
});