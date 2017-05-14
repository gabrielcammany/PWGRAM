/**
 * Created by Gabriel on 23/04/2017.
 */


$(function() {
    var customBar = $('#customnavBar');
    var dropDown = $('#userNameDropdown');
    var login = $('#navBar');
    var user = $('#user_acces_icon').attr('data-content');


    setNumNotifications();
    //setNumComments();

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
            var num = (JSON.parse($response));
            if(num != 0){
                numberNotification.text(num);
                $.ajax({
                    type: 'post',
                    url: '/getUserNotifications',
                    data: {"dropdown": 1},
                    success: function ($response) {
              //          console.log($response);
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
    for(var i = 0;i<list.length && i<4;i++){
        var post = list[i].post_id.split("_");
        if(!controller){
            time = getTimeDifference(list[i].created_at);
        }else{
            var time = list[i].created_at;
        }
        if(list[i].event_id == 1){
            if(i == list.length-1) {
                tableNotifications.append("<li class='tableNotificationsText'><p><label class='textList'>A <a class='titlePost' href='/profile/" + list[i].user_fired_event + "'>"+list[i].user_fired_event+"</a>" +
                    " le ha gustado tu imagen</label></p><p class='overFlow'>\"  <a class='titlePost' href='/image/" + post[0] + "'>"+ post[1] + "</a>\"  " +"<label class='tiempo'>  " + time + "</label></p>" +"</li>")
            }else if(i == 0){
                tableNotifications.append("<li class='tableNotificationsText'><p><label class='textListTop'>A <a class='titlePost' href='/profile/" + list[i].user_fired_event + "'>"+list[i].user_fired_event+"</a>" +
                    " le ha gustado tu imagen </label></p> \"<a class='titlePost' href='/image/" + post[0] + "'>"+ post[1] + "</a>\"  " +"<label class='tiempo'>  " + time + "</label>" +"</li><li class=\"divider\"></li>")
            }else{
                tableNotifications.append("<li class='tableNotificationsText'><p><label class='textList'>A <a class='titlePost' href='/profile/" + list[i].user_fired_event + "'>"+list[i].user_fired_event+"</a>" +
                    " le ha gustado tu imagen </label></p> \"<a class='titlePost' href='/image/" + post[0] + "'>"+ post[1] + "</a>\"  " +"<label class='tiempo'>  " + time + "</label>" +"</li><li class=\"divider\"></li>")
            }
        }else{
            if(i == list.length-1) {
                tableNotifications.append("" +
                    "<li class='tableNotificationsText'>" +
                    "<p><label class='textList commentNot'>A <a class='titlePost' href='/profile/"+list[i].user_fired_event+"'>"+list[i].user_fired_event+"</a> ha comentado en tu imagen </label></p>\"" +
                    "<a class='titlePost' href='/image/"+post[0]+"'>"
                    + post[1]+"</a>\" " +
                    "<label class='tiempo'> "+time+"</label>" +
                    "</li>")
            }else if(i == 0){
                tableNotifications.append("" +
                    "<li class='tableNotificationsText'>" +
                    "<p><label class='textListTop commentNot'>A <a class='titlePost' href='/profile/"+list[i].user_fired_event+"'>"+list[i].user_fired_event+"</a> ha comentado en tu imagen </label></p>\"" +
                    "<a class='titlePost' href='/image/"+post[0]+"'>"
                    + post[1]+"</a>\" " +
                    "<label class='tiempo'> "+time+"</label>" +
                    "</li><li class=\"divider\"></li>")
            }else{
                tableNotifications.append("" +
                    "<li class='tableNotificationsText'>" +
                    "<p><label class='textList commentNot'>A <a class='titlePost' href='/profile/"+list[i].user_fired_event+"'>"+list[i].user_fired_event+"</a> ha comentado en tu imagen </label></p>\"" +
                    "<a class='titlePost' href='/image/"+post[0]+"'>"
                    + post[1]+"</a>\" " +
                    "<label class='tiempo'> "+time+"</label>" +
                    "</li><li class=\"divider\"></li>")
            }
        }

    }

}
function getTimeDifference(date){
    var startDate = new Date();
    var actual = new Date(date);
    var seconds = (startDate.getTime() - actual.getTime()) / 1000;
    var minutes = seconds/60;
    var hours = seconds/3600;
    var days = seconds/86400;
    var time = "Ahora";
    if(seconds >= 1) {
        if (days >= 1) {
            if (days >= 1 && days <2) {
                time = Math.floor(days) + " día";
            } else {
                time = Math.floor(days) + " días";
            }
        } else if (hours >= 1) {
            if (hours >= 1 && hours <2) {
                time = Math.floor(hours) + " hora";
            } else {
                time = Math.floor(hours) + " horas";
            }
        } else if (minutes >= 1) {
            if (minutes >= 1 && minutes <2) {
                time = Math.floor(minutes) + " minuto";
            } else {
                time = Math.floor(minutes) + " minutos";
            }
        } else {
            if (seconds >= 1 && seconds <2) {
                time = Math.floor(seconds) + " segundo";
            } else {
                time = Math.floor(seconds) + " segundos";
            }
        }
    }
    return time;
}

function getImageComments(comentaris,i_image,reverse) {
    var comments = "";
    if(comentaris.length != 0 && comentaris != 0){
        for(var i_comments = 0;i_comments<comentaris.length;i_comments++){
            var time = getTimeDifference(comentaris[i_comments][3]);
            comments = comments + "<ul class=\"comments-list\">"
                +"<li class=\"comment\">"
                +"<a class=\"pull-left\" href=\"#\">"
                +"<img class=\"avatar\" src=\"/"+(comentaris[i_comments][2]).replace(".jpg","_100.jpg")+"\" alt=\"avatar\">"
                +"</a>"
                +"<div class=\"comment-body\">"
                +"<div class=\"comment-heading\">"
                +"<h4 class=\"user\">"+comentaris[i_comments][0]+"</h4>"
                +"<h5 class=\"time\"> "+time+"</h5>"
                +"</div>"
                +"<p>"+comentaris[i_comments][1]+"</p>"
                +"</div>"
                +"</li></ul>";
        }
    }else{
        comments = comments + "<ul id='comments-list"+i_image+"' class=\"comments-list\">"
            +"<li class=\"comment\">"
            +"<div class=\"comment-body\">"
            +"<div class=\"comment-heading\">"
            +"<h4 class=\"noComments\">No hay ningún comentario</h4>"
            +"</div>"
            +"</div>"
            +"</li></ul>";
    }
    return comments;
}

function actionCommentListenerImage(button,id_tag,div_tag_aux) {
        var dataSend = {};
        dataSend.image_id = $(button).attr('data-content');
        dataSend.text = $(id_tag+' #commentInput'+$(button).attr('data-content')).val();
        dataSend.user_id = $(id_tag+' #commentInput'+$(button).attr('data-content')).attr('data-content');
        if(dataSend.text != ""){
            $(id_tag+" #commentInput"+dataSend.image_id).css('border-color','rgb(204, 204, 204)');
            $.ajax({
                type: 'post',
                url: '/addComment',
                data: {data:JSON.stringify(dataSend)},
                success: function ($response) {
                    var response = JSON.parse($response);
                    if(response[0]["COUNT(id)"] == "1"){
                        $(id_tag+" #commentInput"+dataSend.image_id).css('border-color','red');
                        $(id_tag+" #statusError"+dataSend.image_id).fadeTo(3000, 700).slideUp(700, function(){
                            $(id_tag+" #statusError"+dataSend.image_id).slideUp(700);
                            $(id_tag+" #commentInput"+dataSend.image_id).css('border-color','rgb(204, 204, 204)');
                        });
                    }else{
                        $.ajax({
                            type: 'post',
                            url: '/updateCommentBox',
                            data: {data:JSON.stringify(dataSend.image_id)},
                            success: function ($response) {
                                console.log("He passat per aqui");
                                var response = JSON.parse($response);
                                $(id_tag+" #comentaris"+dataSend.image_id).html("");
                                $(div_tag_aux+" #comentaris"+dataSend.image_id).html("");
                                for(var i = 0;i<response.length;i++){
                                    var comentari = new Array();
                                    comentari.push(new Array())
                                    comentari[0].push(response[i].username);
                                    comentari[0].push(response[i].text);
                                    comentari[0].push(response[i].img_path);
                                    comentari[0].push(response[i].created_at);
                                    var append = getImageComments(comentari,dataSend.image_id,true);
                                    $(id_tag+" #comentaris"+dataSend.image_id).append(append);
                                    $(div_tag_aux+" #comentaris"+dataSend.image_id).append(append);
                                }
                                $(id_tag+" #commentInput"+dataSend.image_id).val("");
                            }
                        });
                    }
                }
            });
        }else{
            $(id_tag+' #commentInput'+$(button).attr('data-content')).attr('placeholder','El comentario esta vacio!');
            $(id_tag+' #commentInput'+$(button).attr('data-content')).css('border-color','red');
        }

}

function setLikeListenerImage(image,div_tag,div_tag_aux) {
        var data = {};
        data.user_id = ($(image).attr('data-content').split("_"))[1];
        data.image_id = ($(image).attr('data-content').split("_"))[0];
        if($(image).attr('src')=='../assets/img/icons/like.png'){
            $.ajax({
                type: 'post',
                url: '/incLike',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    $(div_tag+' #like'+data.image_id).attr('src','../assets/img/icons/like_filled.png');
                    $(div_tag+' .label_like'+data.image_id).text('Like: '+JSON.parse($response)[0]["likes"]);
                    $(div_tag_aux+' #like'+data.image_id).attr('src','../assets/img/icons/like_filled.png');
                    $(div_tag_aux+' .label_like'+data.image_id).text('Like: '+JSON.parse($response)[0]["likes"]);
                }
            });
        } else {
            $.ajax({
                type: 'post',
                url: '/removeLike',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    $(div_tag+' #like'+data.image_id).attr('src','../assets/img/icons/like.png')
                    $(div_tag+' .label_like'+data.image_id).text('Like: '+JSON.parse($response)[0]["likes"]);
                    $(div_tag_aux+' #like'+data.image_id).attr('src','../assets/img/icons/like.png')
                    $(div_tag_aux+' .label_like'+data.image_id).text('Like: '+JSON.parse($response)[0]["likes"]);
                }
            });
        }

}
/**
 Estos son los listeners de like y comentario de la galeria
 **/

if($('#gallery_pop').length!=0) {
    $('#gallery_pop img.likeImg').on('click', function (e) {
        e.preventDefault();
        //console.log($(this).attr('data-content'));
        setLikeListenerImage(this, '#gallery_pop', '#gallery_recent');
    });

    $('#gallery_pop #commentButton').on('click', function (e) {
        e.preventDefault();
        //console.log($('#gallery_pop #commentInput'+$(this).attr('data-content')).val());
        actionCommentListenerImage(this, '#gallery_pop', '#gallery_recent');
    });
}

if($('#content').length!=0){
    $('#content img.likeImg').on('click',function(e){
        e.preventDefault();
        //console.log($(this).attr('data-content'));
        setLikeListenerImage(this,'#content');
    });

    $('#content #commentButton').on('click',function (e){
        e.preventDefault();
        //console.log($('#gallery_recent #commentInput'+$(this).attr('data-content')).val());
        actionCommentListenerImage(this,'#content');
    });
}

if($('#gallery_recent').length!=0){
    $('#gallery_recent #commentButton').on('click',function (e){
    e.preventDefault();
    //console.log($('#gallery_recent #commentInput'+$(this).attr('data-content')).val());
    actionCommentListenerImage(this,'#gallery_recent','#gallery_pop');
    });

    $('#gallery_recent img.likeImg').on('click',function(e){
        e.preventDefault();
        //console.log($(this).attr('data-content'));
        setLikeListenerImage(this,'#gallery_recent','#gallery_pop');
    });
}


