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
        console.log($response);
            $images = JSON.parse($response);
            console.log(typeof ($response));
            var size = $response.length;
            for (var i_image in $images){
                var array = $images[i_image].img_path.split('/');
                var path = $images[i_image].img_path.split('.');
                $('#gallery_pop').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
                    "<img class='img-responsive img_profile' src='../"+path[0]+"_400.jpg' alt=''" +
                    "</div></a>" +
                    "<div class='buttons_icons'>" +
                    "<a class='btn btn-simple btn-just-icon'>" +
                    "<img src='../assets/img/icons/like.png' id='"+i_image+"' width='30' height='30'>" +
                    "</a><a class='btn btn-simple btn-just-icon' >" +
                    "<img src='../assets/img/icons/comments.png' id='"+i_image + i_image+"' width='30' height='30'>" +
                    "</a></div>" +
                    "<a href='/profile/"+array[3]+"' id='link_username'><h3 id='username'>"+array[3]+"</h3></a>" +
                    "<h3>"+$images[i_image].title+"</h3>" );

                $("#"+i_image).on('click',{index:i_image},function(e) {
                    console.log('title: ', $images[e.data.index].title);
                    if ($('#' + e.data.index).attr('src') == '../assets/img/icons/like.png') {
                        //console.log('0--> ',e.data.path);
                        $.ajax({
                            type: 'post',
                            url: '/incLike',
                            data: {"path": $images[e.data.index].img_path},
                            success: function ($response) {
                                $('#' + e.data.index).attr('src', '../assets/img/icons/like_filled.png');
                                console.log(JSON.parse($response)['likes']);
                            }
                        });

                    } else {
                        $.ajax({
                            type: 'post',
                            url: '/removeLike',
                            data: {"path": $images[e.data.index].img_path},
                            success: function ($response) {
                                $('#' + e.data.index).attr('src', '../assets/img/icons/like.png');
                                console.log(JSON.parse($response)['likes']);
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
        success: function ($response_v2) {
            console.log($response_v2);
            $images_v2 = JSON.parse($response_v2);
            for (var ri_image in $images_v2){
                var array = $images_v2[ri_image].img_path.split('/');
                var path = $images_v2[ri_image].img_path.split('.');
                $('#gallery_recent').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
                    "<img class='img-responsive img_profile' src='../"+path[0]+"_400.jpg' alt=''" +
                    "</div></a>" +
                    "<div class='buttons_icons'>" +
                    "<a class='btn btn-simple btn-just-icon'>" +
                    "<img src='../assets/img/icons/like.png' id='"+ri_image+"' width='30' height='30'>" +
                    "</a><a class='btn btn-simple btn-just-icon' >" +
                    "<img src='../assets/img/icons/comments.png' id='"+ri_image + ri_image+"' width='30' height='30'>" +
                    "</a></div>" +
                    "<a href='/profile/"+array[3]+"' id='link_username'><h3 id='username'>"+array[3]+"</h3></a>" +
                    "<h3>"+$images_v2[ri_image].title+"</h3>" );

                $("#"+ri_image).on('click',{index_v2:ri_image},function(e) {
                    console.log('title: ', $images_v2[e.data.index_v2].title);
                    if ($('#' + e.data.index_v2).attr('src') == '../assets/img/icons/like.png') {
                        //console.log('0--> ',e.data.path);
                        $.ajax({
                            type: 'post',
                            url: '/incLike',
                            data: {"path": $images_v2[e.data.index_v2].img_path},
                            success: function ($response_v2) {
                                $('#' + e.data.index_v2).attr('src', '../assets/img/icons/like_filled.png');
                                console.log(JSON.parse($response_v2)['likes']);
                            }
                        });

                    } else {
                        $.ajax({
                            type: 'post',
                            url: '/removeLike',
                            data: {"path": $images_v2[e.data.index_v2].img_path},
                            success: function ($response_v2) {
                                $('#' + e.data.index_v2).attr('src', '../assets/img/icons/like.png');
                                console.log(JSON.parse($response_v2)['likes']);
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