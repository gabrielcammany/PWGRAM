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
/*
function getImageComments(comentaris,i_image,idTag,reverse) {
    var comments = "";
    if(comentaris.length != 0 && comentaris != 0){
        if(reverse){
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
            for(var i_comments = comentaris.length-1;i_comments>=0 && i_comments>comentaris.length-4;i_comments--) {
                var time = getTimeDifference(comentaris[i_comments][3]);
                comments = comments + "<ul class=\"comments-list\">"
                    + "<li class=\"comment\">"
                    + "<a class=\"pull-left\" href=\"#\">"
                    + "<img class=\"avatar\" src=\"/" + (comentaris[i_comments][2]).replace(".jpg", "_100.jpg") + "\" alt=\"avatar\">"
                    + "</a>"
                    + "<div class=\"comment-body\">"
                    + "<div class=\"comment-heading\">"
                    + "<h4 class=\"user\">" + comentaris[i_comments][0] + "</h4>"
                    + "<h5 class=\"time\"> " + time + "</h5>"
                    + "</div>"
                    + "<p>" + comentaris[i_comments][1] + "</p>"
                    + "</div>"
                    + "</li></ul>";
            }
        }
    }else{
        comments = comments + "<ul id='comments-list"+i_image+idTag+"' class=\"comments-list\">"
            +"<li class=\"comment\">"
            +"<div class=\"comment-body\">"
            +"<div class=\"comment-heading\">"
            +"<h4 class=\"noComments\">No hay ningún comentario</h4>"
            +"</div>"
            +"</div>"
            +"</li></ul>";
    }
    return comments;
}*/
/*
function setCommentListenerImage(i_image,idTag,$images) {
    $("#"+i_image+"comment"+idTag).on('click',{index:i_image,array:$images,tag:idTag},function(e){
        var data = {};
        data.image_id = e.data.array[e.data.index].id;
        data.text = $("#commentInput"+e.data.index+e.data.tag).val();
        data.user_id = e.data.array[e.data.index].user_id;
        if(data.text != ""){
            $("#commentInput"+e.data.index+e.data.tag).css('border-color','rgb(204, 204, 204)');
            $.ajax({
                type: 'post',
                url: '/addComment',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    //console.log($response);
                    var response = JSON.parse($response);
                    if(response != 1) {
                        if (response[0]["COUNT(id)"] == "1") {
                            $("#commentInput" + e.data.index + e.data.tag).css('border-color', 'red');
                            $("#statusError" + i_image + e.data.tag).fadeTo(3000, 700).slideUp(700, function () {
                                $("#statusError" + i_image + e.data.tag).slideUp(700);
                                $("#commentInput" + e.data.index + e.data.tag).css('border-color', 'rgb(204, 204, 204)');
                            });
                        } else {
                            var data = {};
                            data.image_id = e.data.array[e.data.index].id;
                            $.ajax({
                                type: 'post',
                                url: '/updateCommentBox',
                                data: {data: JSON.stringify(data)},
                                success: function ($response) {
                                    var response = JSON.parse($response);
                                    $("#comentaris" + e.data.index + e.data.tag).html("");
                                    for (var i = 0; i < response.length; i++) {
                                        var comentari = new Array();
                                        comentari.push(new Array())
                                        comentari[0].push(response[i].username);
                                        comentari[0].push(response[i].text);
                                        comentari[0].push(response[i].img_path);
                                        comentari[0].push(response[i].created_at);
                                        $("#comentaris" + e.data.index + e.data.tag).append(getImageComments(comentari, e.data.index, e.data.tag, true));
                                    }
                                    $("#commentInput" + e.data.index + e.data.tag).val("");

                                }
                            });
                        }
                    }
                }
            });
        }else{
            $("#commentInput"+e.data.index+idTag).attr('placeholder','El comentario esta vacio!');
            $("#commentInput"+e.data.index+idTag).css('border-color','red');
        }

    });
}*/

function actionCommentListenerImage(button,contentText,user_id,img_id,id_tag) {
        var data = {};
        data.image_id = img_id;
        data.text = contentText;
        data.user_id = user_id;
        if(contentText != ""){
            $(id_tag+" #commentInput"+img_id).css('border-color','rgb(204, 204, 204)');
            $.ajax({
                type: 'post',
                url: '/addComment',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    console.log($response);
                    var response = JSON.parse($response);
                    if(response[0]["COUNT(id)"] == "1"){
                        $(id_tag+" #commentInput"+img_id).css('border-color','red');
                        $(id_tag+" #statusError"+img_id).fadeTo(3000, 700).slideUp(700, function(){
                            $(id_tag+" #statusError"+img_id).slideUp(700);
                            $(id_tag+" #commentInput"+img_id).css('border-color','rgb(204, 204, 204)');
                        });
                    }else{
                        var data = {};
                        data.image_id = img_id;
                        $.ajax({
                            type: 'post',
                            url: '/updateCommentBox',
                            data: {data:JSON.stringify(data)},
                            success: function ($response) {
                                var response = JSON.parse($response);
                                console.log("HHHEY"+response);
                                $(id_tag+" #comments-list"+img_id).empty();
                                for(var i = 0;i<response.length;i++){
                                    var comentari = new Array();
                                    comentari.push(new Array())
                                    comentari[0].push(response[i].username);
                                    comentari[0].push(response[i].text);
                                    comentari[0].push(response[i].img_path);
                                    comentari[0].push(response[i].created_at);
                                    var box_comment=''+
                                        '<li class="comment">'+
                                            '<a class="pull-left" href="#">'+
                                            '<img class="avatar" src="'+response[i].img_path+'">'+
                                            '</a>'+
                                            '<div class="comment-body">'+
                                            '<div class="comment-heading">'+
                                            '<h4 class="user">'+ response[i].username +'</h4>'+
                                        '<h5 class="time">'+  response[i].created_at +'</h5>'+
                                        '</div>'+
                                        '<p>'+ response[i].text + '</p>'+
                                        '</div>'+
                                        '</li>';
                                        $(id_tag+" #comments-list"+img_id).append(box_comment);
                                }
                                $(id_tag+" #comments-list"+img_id).val("");

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

function setLikeListenerImage(image,user_id,image_id,div_tag) {
        var data = {};
        data.user_id =user_id;
        data.image_id = image_id;
        if($(image).attr('src')=='../assets/img/icons/like.png'){
            $.ajax({
                type: 'post',
                url: '/incLike',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    console.log('inc-->'+$response);
                    $(image).attr('src','../assets/img/icons/like_filled.png');
                    var nLikes = JSON.parse($response)[0]["likes"];
                    console.log(nLikes);
                    $(div_tag+' .label_like'+image_id).text('Like: '+nLikes);
                }
            });
        } else {
            $.ajax({
                type: 'post',
                url: '/removeLike',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    //console.log('Dec-->'+$response);
                    $(image).attr('src','../assets/img/icons/like.png');
                    var nLikes = JSON.parse($response)[0]["likes"];
                    $(div_tag+' .label_like'+image_id).text('Like: '+nLikes);
                }
            });
        }

}
/*
function fillImage($images,i_image,idTag){
        setImagePlaceHolder(getImageComments($images[i_image].comments,i_image,idTag,false),$images,i_image,idTag);

        addListenersImage(i_image,idTag,$images);

}*/

/**
 Estos son los listeners de like y comentario de la galeria
 **/

$('#gallery_pop img.likeImg').on('click',function(e){
    e.preventDefault();
    console.log($(this).attr('data-content'));
    setLikeListenerImage(this,$(this).attr('data-content'),$(this).attr('data-content'),'#gallery_pop');
});

$('#gallery_recent img.likeImg').on('click',function(e){
    e.preventDefault();
    console.log($(this).attr('data-content'));
    setLikeListenerImage(this,$(this).attr('data-content'),$(this).attr('data-content'),'#gallery_recent');
});

$('#gallery_pop #commentButton').on('click',function (e){
    e.preventDefault();
    console.log($('#gallery_pop #commentInput'+$(this).attr('data-content')).val());
    actionCommentListenerImage(this,$('#gallery_pop #commentInput'+$(this).attr('data-content')).val(),$('#gallery_pop #commentInput'+$(this).attr('data-content')).attr('data-content'),$(this).attr('data-content'),'#gallery-pop');
});
$('#gallery_recent #commentButton').on('click',function (e){
    e.preventDefault();
    console.log($('#gallery_recent #commentInput'+$(this).attr('data-content')).val());
    actionCommentListenerImage(this,$('#gallery_recent #commentInput'+$(this).attr('data-content')).val(),$('#gallery_recent #commentInput'+$(this).attr('data-content')).attr('data-content'),$(this).attr('data-content'),'#gallery_recent');
});