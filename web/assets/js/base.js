/**
 * Created by Gabriel on 23/04/2017.
 */


$(function() {
    var customBar = $('#userDropdown');
    var login = $('#navBar');
    if(localStorage.getItem("user") === null){
        console.log("Empty");
        customBar.hide();
        login.show();
    }else{
        login.hide();
        customBar.show();
        var anchor = document.getElementById('userNameDropdown');
        anchor.innerHTML += "  " +JSON.parse(localStorage.getItem("user")).username;
    }
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