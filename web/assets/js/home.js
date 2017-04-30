/**
 * Created by Xps_Sam on 17/04/2017.
 */

$(function(){

   /* var username = localStorage.getItem('user').username;
    var email = localStorage.getItem('user').email;
    $('#info_profile').append("<h1 class='page-header text-header' id='title_header'>"+username+"<small>"+email+"</small></h1>");
*/
    $.ajax({
        type: 'post',
        url: '/popular_images',
        success: function ($response) {
            $images = JSON.parse($response);
            var size = $response.length;
            var i_image = 0;
            for (i_image in $images){
                var array = $images[i_image].img_path.split('/');
                var path = $images[i_image].img_path.split('.');
                if($images[i_image].liked != undefined){
                    liked = "_filled";
                }else{
                    liked = "";
                }
                $('#gallery_pop').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
                    "<img class='img-responsive img_profile' src='../"+path[0]+"_400.jpg' alt=''" +
                    "</div></a>" +
                    "<div class='buttons_icons'>" +
                    "<a class='btn btn-simple btn-just-icon'>" +
                    "<img src='../assets/img/icons/like"+liked+".png' id='"+i_image+"popular' width='30' height='30'>" +
                    "</a><a class='btn btn-simple btn-just-icon' >" +
                    "<img src='../assets/img/icons/comments.png' id='"+i_image + i_image+"' width='30' height='30'>" +
                    "</a></div>" +
                    "<a href='/profile/"+array[3]+"' id='link_username'><h3 id='username'>"+array[3]+"</h3></a>" +
                    "<h3>"+$images[i_image].title+"</h3>" );

                $("#"+i_image+"popular").on('click',{index:i_image,array:$images},function(e) {
                    console.log('id: ', e.data.index);
                    console.log('title: ', e.data.array[e.data.index].title);
                    console.log('title: ', e.data.array[e.data.index].id);
                    var data = {};
                    data.user_id = e.data.array[e.data.index].user_id;
                    data.image_id = e.data.array[e.data.index].id;
                    if ($('#' + e.data.index+'popular').attr('src') == '../assets/img/icons/like.png') {
                        //console.log('0--> ',e.data.path);
                        $.ajax({
                            type: 'post',
                            url: '/incLike',
                            data: {data:JSON.stringify(data)},
                            success: function ($response) {
                                $('#' + e.data.index+'popular').attr('src', '../assets/img/icons/like_filled.png');
                                console.log($response);
                            }
                        });

                    } else {
                        $.ajax({
                            type: 'post',
                            url: '/removeLike',
                            data: {data:JSON.stringify(data)},
                            success: function ($response) {
                                $('#' + e.data.index+'popular').attr('src', '../assets/img/icons/like.png');
                                console.log($response);
                            }
                        });
                    }
                });
            }
        }
    });

    $.ajax({
        type: 'post',
        url: '/getRecentImages',
        success: function ($response) {
            $images = JSON.parse($response);
            var i_image = 0;
            for (i_image in $images){
                var array = $images[i_image].img_path.split('/');
                var path = $images[i_image].img_path.split('.');
                if($images[i_image].liked != undefined){
                    liked = "_filled";
                }else{
                    liked = "";
                }
                $('#gallery_recent').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
                    "<img class='img-responsive img_profile' src='../"+path[0]+"_400.jpg' alt=''" +
                    "</div></a>" +
                    "<div class='buttons_icons'>" +
                    "<a class='btn btn-simple btn-just-icon'>" +
                    "<img src='../assets/img/icons/like"+liked+".png' id='"+i_image+"recent' width='30' height='30'>" +
                    "</a><a class='btn btn-simple btn-just-icon' >" +
                    "<img src='../assets/img/icons/comments.png' id='"+i_image + i_image+"' width='30' height='30'>" +
                    "</a></div>" +
                    "<a href='/profile/"+array[3]+"' id='link_username'><h3 id='username'>"+array[3]+"</h3></a>" +
                    "<h3>"+$images[i_image].title+"</h3>" );

                $("#"+i_image+"recent").on('click',{index:i_image,array:$images},function(e) {
                    var data = {};
                    data.user_id = e.data.array[e.data.index].user_id;
                    data.image_id = e.data.array[e.data.index].id;
                    if ($('#' + e.data.index+'recent').attr('src') == '../assets/img/icons/like.png') {
                        //console.log('0--> ',e.data.path);
                        $.ajax({
                            type: 'post',
                            url: '/incLike',
                            data: {data:JSON.stringify(data)},
                            success: function ($response) {
                                $('#' + e.data.index+'recent').attr('src', '../assets/img/icons/like_filled.png');
                                console.log($response);
                            }
                        });
                    } else {
                        $.ajax({
                            type: 'post',
                            url: '/removeLike',
                            data: {data:JSON.stringify(data)},
                            success: function ($response) {
                                $('#' + e.data.index+'recent').attr('src', '../assets/img/icons/like.png');
                                console.log($response);
                            }
                        });
                    }
                });
            }
        }
    });
});
/**
 * Funcio encarregada de fer la peticio al servidor per tal de saber el path de les fotos necesaries.
 */
function ajaxGallery(){

}
function showEditForm(){
    $('#edit_modal .editBox').fadeOut('fast',function(){
        $('.editBox').fadeIn('fast');

        $('.modal-title').html('Edit profile');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function openEditModal(){
    showEditForm();
    setTimeout(function(){
        $('#edit_modal').modal('show');
    }, 230);

}



$('.image_rounded').on('over',function(){

});