/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */

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
    e.preventDefault()
    console.log("Hola");
    if(validaEmail($('#email_reg').val())&&validaUsername($('#username').val())&&validatePasswordRegistration($('#password_reg').val(),$('#password_confirmation').val())&&validateDate($('#date').val())){
        console.log('Todo OK!');
        var reg = new Object();

        reg.email = $('#email').val();
        reg.pass = $('#password_reg').val();
        reg.date = $('#date').val();
        reg.confirm_pass = $('#password_confirmation').val();
        reg.username = $('#username').val();
        reg.username = $('#username').val();
        //var stringData = JSON.stringify(reg);
        $.ajax({
            type: 'POST',
            url: '/SignUp',
            data: $('#infoRegistro').serialize(),
            dataType: 'json',
            success: function ($response) {
                console.log("ha sido success");

            }
        });
    }else{
        shakeModalRegistration();
    }

});

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
             $('input[type="password"]').val('');
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
}
function shakeModalRegistration(){
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("Invalid information combination");
    $('input[type="password"]').val('');
    setTimeout( function(){
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000 );
}

$('#login_home').click(function (e) {
    e.preventDefault();
    openLoginModal();
});

function validaEmail($v1){
    console.log($v1);
    var usernameRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(usernameRegex.test($v1)){
        return true;
    }else{
        console.log('error email');
        return false;
    }

    return false;
}

function validaUsername($v1){
    var usernameRegex = /^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
    if(usernameRegex.test($v1)){
        return true;
    }else{
        console.log('error username');
        return false;
    }

}
function validatePassword($v1){

    if ($v1.length < 6) {
        return false;
    }
    if ($v1.search(/[a-z]/i) < 0) {
        return false;
    }
    if ($v1.search(/[A-Z]/i) < 0) {
        return false;
    }
    if ($v1.search(/[0-9]/) < 0) {
        return false;
    }
    return true;
}
function validateDate(dateString){
    var regEx = /(\d{4})[-\/](\d{2})[-\/](\d{2})/
    if(regEx.test(dateString)){
        return true;
    }else{

        console.log('error Date');
        return false;
    }
}


function validatePasswordRegistration($v1,$v2){

    if($v1!=$v2){

        console.log('error password');
        return false;
    }
    if ($v1.length < 6) {
        console.log('error password');

        return false;
    }
    if ($v1.search(/[a-z]/i) < 0) {
        console.log('error password');

        return false;
    }
    if ($v1.search(/[A-Z]/i) < 0) {
        console.log('error password');

        return false;
    }

    if ($v1.search(/[0-9]/) < 0) {
        console.log('error password');

        return false;
    }
    return true;
}

/*
    Funció encarregada de llegir la url introduida per l'usuari i carregar la foto de perfil seleccionada
*/
function readURL(input) {
    console.log('adios tete');
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log('adios tete2');
            $('#perfil_reg').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
/*
Funció que espera a que el usuari realitzi algun canvi en el input per poder cridar a la funció encarregada
de realitzar el canvi de la imatge de defecte per la seleccionada.
 */
$("#btnSelectImage").change(function(){
    console.log('hola tete');
    readURL(this);
});