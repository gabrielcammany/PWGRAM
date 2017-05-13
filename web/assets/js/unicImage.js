var $main_image;
$(function() {

    /*$.ajax({
        type: 'post',
        url: '/getInfoImage',
        data: {id: $('#main_image').attr('data-content')},
        success: function ($response) {
                if($response!=0) {
                    $main_image = JSON.parse($response);
                    console.log($main_image);

                    var array = $main_image[0].img_path.split('/');
                    var path = $main_image[0].img_path.split('.');
                    //i_image =0;
                    var time = getTimeDifference($main_image[0].created_at);
                    //console.log("Han pasado "+ time);
                    idTag='content';
                    var comments = getImageComments($main_image[0].comments,0,idTag,false);
                    $('#main_image').attr('src', '../'+$main_image[0].img_path);
                   /* $('#content').prepend("<h2 id='title'>" + $image[0].title + "</h2>" +
                        "<p><h2><A href='/profile/" + array[3] + "' id='link_username'>" + array[3] + "</A></h2></p>" +
                        "<p id='label_like'>Likes: " + $image[0].likes + "</p>" +
                        "<div class='input-group'>"+
                    "<input id='commentInput"+i_image+idTag+"' class='form-control' placeholder='Añadir un comentario' type='text'>"+
                    "<span class=\"input-group-addon\" id='"+i_image+"comment"+idTag+"'>"+
                    "<a ><i class=\"fa fa-edit\"></i></a>"+
                    "</span>"+
                    "  </div>" +
                        "<div id='comentaris"+i_image+idTag+"' >"+comments+"</div>");*/
                    /*if($main_image[0].liked != undefined){
                        liked = "_filled";
                    }else{
                        liked = "";
                    }*/
                    /*$('#content').prepend(
                        "<h2 id='title'>" + $main_image[0].title + "</h2>" +
                        "<p><h2><A href='/profile/" + array[3] + "' id='link_username'>" + array[3] + "</A></h2></p>" +
                        "<p id='label_like'>Likes: " + $main_image[0].likes + "</p>" +
                        "<p id='label_visits'>Visitas: "+$main_image[0].visits+"</p>"+
                        "<p id='label_time'>Timepo subido: "+time+"</p>"+
                        "<div class=\"col-sm-15 divLinia\">"+
                        "<div class=\"panel panel-white post panel-shadow divLinia\">"+
                        "<div id='statusError"+0+idTag+"' class=\"alert alert-danger statusError\" role=\"alert\" hidden>"+
                        "<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>"+
                        "<span class=\"sr-only\">Error:</span>"+" Solo puedes añadir un comentario en la imagen</div>"+
                        "<div id='divLinia"+0+idTag+"' class=\"post-footer divLinia\">" +
                        "<div class='row' >" +
                        "<div class='col likeButton' align='center'> " +
                        "<a class='btn btn-simple btn-just-icon'><img src='../assets/img/icons/like"+liked+".png' id='"+0+idTag+"' width='30' height='30'></a></div>"+
                        "<div class='col '>" +
                        "<div class=\"input-group\">"+
                        "<input id='commentInput"+0+idTag+"' class=\"form-control\" placeholder=\"Añadir un comentario\" type=\"text\">" +
                        "<span class=\"input-group-addon\" id='"+0+"comment"+idTag+"'>"+
                        "<a ><i class=\"fa fa-edit\"></i></a></span></div></div>" +
                        "</div><div id='comentaris"+0+idTag+"' >"+comments+"</div></div></div></div></div>"
                    );


              //      setCommentListenerImage(i_image,idTag,$main_image);

                    $('#titleImage').attr('placeholder',$main_image[0].title);
                    //fillImage($image,0,'main_image');
                }
            }

    });*/
});

$('#deleteImage').on('click',   function(e){
    e.preventDefault();
    swal({
            title: "Estas seguro que quieres eliminar esta imagen?",
            text: "Considere que no podrá recuperar la respectiva imagen!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, eliminar!",
            closeOnConfirm: false
        },
        function(){
        console.log('#@#'+$main_image[0].img_path);

            $.ajax({
                type: 'post',
                url: '/deleteImage',
                data: {id: $('#main_image').attr('data-content'),path: $main_image[0].img_path},
                success: function ($response) {
                    console.log('##'+$response);
                    if($response!=0) {
                        $main_image = JSON.parse($response);
                        swal("Deleted!", "Su imagen ha sido eliminada.", "success");
                        window.location='../';
                    }else{
                        swal("Not Deleted!", "El path especificado no se encuentra.", "error");
                    }
                }

            });
    });
});

$('#editImage').on('click',function(e){
    e.preventDefault();
   /* $('#formEditImage').show();
    $('#title_input').val($image[0].title);
    if($image[0].private == 0){
        $('#public').attr('checked',true);
    }else{
        $('#private').attr('checked',true);
    }*/

    //$('#titleImage').attr('value',$main_image[0].title);
    openEditModal();
    //$('#edit_modal').show();
});
$('#updateImage').click(function (e) {
    e.preventDefault();
    if(validateTitle($('#titleImage').val())) {
        var object = {};
        object.id_image = $('#main_image').attr('data-content');
        object.title = $('#titleImage').val();
        object.private = $('#private').is(":checked");
        object.public = $('#public').is(":checked");
        var stringData = JSON.stringify(object);
        console.log('@@@ '+stringData+' @@@');
        $.ajax({
            type: 'post',
            url: '/editImageInfo',
            data: {myData: stringData},
            success: function ($response) {
                var result = JSON.parse($response);
                switch(result['result']){
                    case 0:
                        $('.error').addClass('alert alert-danger').html("Error en actualizar la informacion");
                        break;
                    case 1:
                        $('.error').addClass('alert alert-danger').html("Titulo incorrecto");
                        break;
                    case 2:
                        swal({
                            title: "Actualizada!",
                            type: "success",
                            timer:2000,
                            showConfirmButton: false
                        });
                        $('#close_modal').click();
                        window.location = "/profile/"+result['username'];
                        break;
                    default:
                        $('.error').addClass('alert alert-danger').html("Error desconocido");
                        break;
                }

            }
        });
    }else{
        $('.error').addClass('alert alert-danger').html("Titulo incorrecto");
    }
});

$('#saveChanges').on('click',function(e){
    e.preventDefault();
    //console.log("Buenas");
    //console.log(JSON.parse($('#formEditImage').serializeArray()));
    $.ajax({
        type: 'post',
        url: '/editImageInfo',
        data: {myData: $('#formEditImage').serializeArray()},
        success: function ($response) {
            console.log('##'+$response);
        }

    });
});

function showEditForm(){
    $('#edit_modal').fadeIn('fast');
        //$('.loginBox').fadeIn('fast');
        /*$('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');
        });*/

        $('.modal-title').html('Editar imagen');

    $('.error').removeClass('alert alert-danger').html('');
}

function openEditModal(){
    showEditForm();
    setTimeout(function(){
        $('#edit_modal').modal('show');
    }, 230);

}

function validateTitle(v1) {
    if(!v1){
        $('.error').addClass('alert alert-danger').html("Titulo vacio!");
        return false;
    }else{
        return true;
    }
}

$('#content img.likeImg').on('click',function(e){
    e.preventDefault();
    console.log($(this).attr('data-content'));
    setLikeListenerImage(this,$(this).attr('data-content'),$(this).attr('data-content'),'#content');
});

$('#content #commentButton').on('click',function (e) {
    e.preventDefault();
    console.log($('#content #commentInput' + $(this).attr('data-content')).val());
    actionCommentListenerImage(this, $('#content #commentInput' + $(this).attr('data-content')).val(), $('#content #commentInput' + $(this).attr('data-content')).attr('data-content'), $(this).attr('data-content'), '#content');
    if ($('#content #commentInput' + $(this).attr('data-content')).val() != ""){
        var date = new Date();
        var time = getTimeDifference(date);
        $('.comments-list').prepend(
            "<li class=\"comment\">"
            + "<a class=\"pull-left\" href=\"#\">"
            + "<img class=\"avatar\" src=\"/" + $('#user_acces_icon').attr('data-target') + "\" alt=\"avatar\">"
            + "</a>"
            + "<div class=\"comment-body\">"
            + "<div class=\"comment-heading\">"
            + "<h4 class=\"user\">" + $('#user_acces_icon').attr('data-content') + "</h4>"
            + "<h5 class=\"time\"> "+time+" </h5>"
            + "</div>"
            + "<p>" + $('#content #commentInput' + $(this).attr('data-content')).val() + "</p>"
            + "</div>"
            + "</li>"
        );
    }
    $('#content #commentInput'+$(this).attr('data-content')).val("");
});
