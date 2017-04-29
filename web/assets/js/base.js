/**
 * Created by Gabriel on 23/04/2017.
 */


$(function() {
    var customBar = $('#customnavBar');
    var dropDown = $('#userNameDropdown');
    var login = $('#navBar');
    if(dropDown.attr('data-content') == ""){
        customBar.hide();
        login.show();
    }else{
        login.hide();
        customBar.show();
    }
    /*$.ajax({
        type: 'post',
        url: '/getUserNotifications',
        data: {"dropdown": 1},
        success: function ($response) {
            if($response != "false"){
                console.log(JSON.parse($response));
                var numberNotification = $('#notificationNumber');
                numberNotification.text($response.length);
            }else{
                var numberNotification = $('#notificationNumber');
                numberNotification.hide();
            }
        }
    });*/
    var button = $('#logout');
    button.click(function () {
        swal({
                title: "Estas seguro?",
                text: "Te desconectaras y deberas volverte a conectar para disfrutar de PwGram...",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, quiero desconectarme!",
                closeOnConfirm: false
            },
            function(){
                swal({
                        title: "Hasta pronto!",
                        text: "Te has desconectado satisfactoriamente :(",
                        type: "success",
                        confirmButtonText: "Volver al inicio"
                    },
                    function() {
                        localStorage.clear();
                        document.cookie.split(";").forEach(function (c) {
                            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        window.location = '/';
                    });
            });
    });


});