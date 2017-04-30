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

    setNumNotifications();

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

function setNumNotifications() {

    $.ajax({
        type: 'post',
        url: '/getNumNotifications',
        success: function ($response) {
            var numberNotification = $('#notificationNumber');
            var num = (JSON.parse($response))[0]["COUNT(id)"];
            if(num != 0){
                numberNotification.text(num);
                $.ajax({
                    type: 'post',
                    url: '/getUserNotifications',
                    data: {"dropdown": 1},
                    success: function ($response) {
                        var list = JSON.parse($response)
                        var noNotification = $('#noNotification');
                        addNotifications(list,false);
                        noNotification.hide();
                    }
                });
            }else{
                numberNotification.hide();
            }
        }
    });
}

function addNotifications(list,controller) {
    var tableNotifications = $('#tableNotificationsList');
    console.log(list);
    for(var i = 0;i<list.length && i<4;i++){
        var post = list[i].post_id.split("_");
        if(!controller){
            var startDate = new Date();
            var actual = new Date(list[i].created_at);
            var seconds = (startDate.getTime() - actual.getTime()) / 1000;
            var minutes = seconds/60;
            var hours = seconds/3600;
            var days = seconds/86400;

            if(days >= 1){
                if(days == 1){
                    var time = Math.floor(days)+" día";
                }else{
                    var time = Math.floor(days)+" días";
                }
            }else if(hours >= 1){
                if(hours == 1){
                    var time = Math.floor(hours)+" hora";
                }else{
                    var time = Math.floor(hours)+" horas";
                }
            }else if(minutes >= 1){
                if(minutes == 1){
                    var time = Math.floor(minutes)+" minuto";
                }else{
                    var time = Math.floor(minutes)+" minutos";
                }
            }else{
                if(seconds == 1){
                    var time = Math.floor(seconds)+" segundo";
                }else{
                    var time = Math.floor(seconds)+" segundos";
                }
            }
        }else{
            var time = list[i].created_at;
        }
        if(list[i].event_id == 1){
            if(i == list.length-1) {
                tableNotifications.append("<li class='tableNotificationsText'><p><label class='textList'>A <a class='titlePost' href='/profile/" + list[i].user_fired_event + "'>"+list[i].user_fired_event+"</a>" +
                    " le ha gustado tu imagen</label></p><p class='overFlow'>\"  <a class='titlePost' href='/image/" + post[0] + "'>"+ post[1] + "</a>\"  " +"<label class='tiempo'>  hace " + time + "</label></p>" +"</li>")
            }else{
                tableNotifications.append("<li class='tableNotificationsText'><p><label class='textList'>A <a class='titlePost' href='/profile/" + list[i].user_fired_event + "'>"+list[i].user_fired_event+"</a>" +
                    " le ha gustado tu imagen </label></p> \"<a class='titlePost' href='/image/" + post[0] + "'>"+ post[1] + "</a>\"  " +"<label class='tiempo'>  hace " + time + "</label>" +"</li><div class='divider'></div>")
            }
        }else{
            tableNotifications.append("" +
                "<li class='tableNotificationsText'>" +
                "<label class='textList'>A <a class='titlePost' href='/profile/"+list[i].user_fired_event+"'>"+list[i].user_fired_event+"</a> ha comentado en tu imagen \"" +
                "<a class='titlePost' href='/image/"+post[0]+"'>"
                + post[1]+"</a>\"" +
                " hace "+time+"</label>" +
                "</li>")
        }

    }

}