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

function fillGallery(request,idTag) {
    $.ajax({
        type: 'post',
        url: request,
        data: {myData: $('#userName').attr('data-content')},
        success: function ($response) {
            $images = JSON.parse($response);
            for (var i_image in $images){

                setImagePlaceHolder(getImageComments($images[i_image].comments,i_image,idTag,false),$images,i_image,idTag);

                addListenersImage(i_image,idTag,$images);

            }
        }
    });
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
}

function setImagePlaceHolder(comments,$images,i_image,idTag) {
    var array = $images[i_image].img_path.split('/');
    var path = $images[i_image].img_path.split('.');
    if($images[i_image].liked != undefined){
        liked = "_filled";
    }else{
        liked = "";
    }
    var stringToAppend = "<div class='col-md-3 portfolio-item img_gallery panel panel-default flex-col'>" +
        "<figure class='snip0016'><img class='img-responsive img_profile ' src='../"+path[0]+"_400.jpg' />" +
        "<figcaption> <h2><span><A id='title_image' href='/image/"+$images[i_image].id+"'>"+$images[i_image].title+"</A></span></h2><p><h2><A href='/profile/"+array[3]+"' id='link_username'>"+array[3]+"</A></h2></p><p id='label_like'>Likes: "+$images[i_image].likes+"</p></figcaption></figure>" +
        "<div class=\"col-sm-15 divLinia\">"
        +"<div class=\"panel panel-white post panel-shadow divLinia\">"+
        "<div id='statusError"+i_image+idTag+"' class=\"alert alert-danger statusError\" role=\"alert\" hidden>"+
        "<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>"+
        "<span class=\"sr-only\">Error:</span>"+
        " Solo puedes añadir un comentario en la imagen"+
        "</div>"+
        "<div id='divLinia"+i_image+idTag+"' class=\"post-footer divLinia\">" +
        "<div class='row' >" +
        "   <div class='col likeButton' align='center'> " +
        "       <a class='btn btn-simple btn-just-icon'><img src='../assets/img/icons/like"+liked+".png' id='"+i_image+idTag+"' width='30' height='30'></a>" +
        "   </div>"
        +"  <div class='col '>" +
        "   <div class=\"input-group\">"
        +"<input id='commentInput"+i_image+idTag+"' class=\"form-control\" placeholder=\"Añadir un comentario\" type=\"text\">"
        +"<span class=\"input-group-addon\" id='"+i_image+"comment"+idTag+"'>"
        +"<a ><i class=\"fa fa-edit\"></i></a>"
        +"</span>"
        +"  </div>" +
        "   </div>" +
        "</div><div id='comentaris"+i_image+idTag+"' >"+comments+"</div>"
        +"</div>"
        +"</div>"
        +"</div></div>" +
        "</div>";
    $('#'+idTag).append(stringToAppend);
}

function addListenersImage(i_image,idTag,$images) {
    setLikeListenerImage(i_image,idTag,$images);
    setCommentListenerImage(i_image,idTag,$images);
}

function setCommentListenerImage(i_image,idTag,$images) {
    $("#"+i_image+"comment"+idTag).on('click',{index:i_image,array:$images,tag:idTag},function(e){
        var data = {};
        data.image_id = e.data.array[e.data.index].id;
        data.text = $("#commentInput"+e.data.index+idTag).val();
        data.user_id = e.data.array[e.data.index].user_id;
        if($("#commentInput"+e.data.index+idTag).val() != ""){
            $("#commentInput"+e.data.index+idTag).css('border-color','rgb(204, 204, 204)');
            $.ajax({
                type: 'post',
                url: '/addComment',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    var response = JSON.parse($response);
                    if(response[0]["COUNT(id)"] == "1"){
                        $("#commentInput"+e.data.index+idTag).css('border-color','red');
                        $("#statusError"+i_image+idTag).fadeTo(3000, 700).slideUp(700, function(){
                            $("#statusError"+i_image+idTag).slideUp(700);
                            $("#commentInput"+e.data.index+idTag).css('border-color','rgb(204, 204, 204)');
                        });
                    }else{
                        var data = {};
                        data.image_id = e.data.array[e.data.index].id;
                        $.ajax({
                            type: 'post',
                            url: '/updateCommentBox',
                            data: {data:JSON.stringify(data)},
                            success: function ($response) {
                                console.log($response);
                                var response = JSON.parse($response);
                                $("#comentaris"+e.data.index+idTag).html("");
                                for(var i = 0;i<response.length;i++){
                                    var comentari = new Array();
                                    comentari.push(new Array())
                                    comentari[0].push(response[i].username);
                                    comentari[0].push(response[i].text);
                                    comentari[0].push(response[i].img_path);
                                    comentari[0].push(response[i].created_at);
                                    $("#comentaris"+e.data.index+e.data.tag).append(getImageComments(comentari,e.data.index,e.data.tag,true));
                                }
                                $("#commentInput"+e.data.index+e.data.tag).val("");

                            }
                        });
                    }
                }
            });
        }else{
            $("#commentInput"+e.data.index+idTag).attr('placeholder','El comentario esta vacio!');
            $("#commentInput"+e.data.index+idTag).css('border-color','red');
        }

    });
}

function setLikeListenerImage(i_image,idTag,$images) {
    $("#"+i_image+idTag).on('click',{index:i_image,array:$images,tag:idTag},function(e){
        var data = {};
        data.user_id = e.data.array[e.data.index].user_id;
        data.image_id = e.data.array[e.data.index].id;
        if($('#'+e.data.index+e.data.tag).attr('src')=='../assets/img/icons/like.png'){
            $.ajax({
                type: 'post',
                url: '/incLike',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    $('#'+e.data.index+e.data.tag).attr('src','../assets/img/icons/like_filled.png');
                }
            });
        } else {
            $.ajax({
                type: 'post',
                url: '/removeLike',
                data: {data:JSON.stringify(data)},
                success: function ($response) {
                    $('#'+e.data.index+e.data.tag).attr('src','../assets/img/icons/like.png');
                }
            });
        }
    });
}