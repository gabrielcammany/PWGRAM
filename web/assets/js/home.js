/**
 * Created by Xps_Sam on 17/04/2017.
 */

$(function(){

   /* var username = localStorage.getItem('user').username;
    var email = localStorage.getItem('user').email;
    $('#info_profile').append("<h1 class='page-header text-header' id='title_header'>"+username+"<small>"+email+"</small></h1>");
*/
    $('#gallery').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
        "<img class='img-responsive' src='../assets/img/examples/chris9.jpg' width='400' height='300' alt=''" +
        "</div></a>" +
        "<div class='buttons_icons'>" +
        "<a href='#like#1' class='btn btn-simple btn-just-icon'>" +
        "<img src='../assets/img/icons/like.png' width='30' height='30'>" +
        "</a><a href='#coments#1' class='btn btn-simple btn-just-icon' >" +
        "<img src='../assets/img/icons/comments.png' width='30' height='30'>" +
        "</a></div>" +
        "<a href='/profile/samuel' id='link_username'><h3 id='username'>samuel</h3></a>" +
        "<h3>Lore Ipsum Lae</h3>" );

    $('#gallery').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
        "<img class='img-responsive' src='../assets/img/examples/chris1.jpg' width='400' height='300' alt=''" +
        "</div></a>" +
        "<div>" +
        "<a href='#like#2' class='btn btn-simple btn-just-icon'>" +
        "<img src='../assets/img/icons/like.png' width='30' height='30'>" +
        "</a><a href='#coments#1' class='btn btn-simple btn-just-icon'>" +
        "<img src='../assets/img/icons/comments.png' width='30' height='30'>" +
        "</a>" +
        "<h3>Lore Ipsum Lae</h3>" );

    $('#gallery').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
        "<img class='img-responsive' src='../assets/img/examples/chris4.jpg' width='400' height='300' alt=''" +
        "</div></a>" +
        "<div>" +
        "<a href='#like#3' class='btn btn-simple btn-just-icon'>" +
        "<img src='../assets/img/icons/like.png' width='30' height='30'>" +
        "</a><a href='#coments#1' class='btn btn-simple btn-just-icon'>" +
        "<img src='../assets/img/icons/comments.png' width='30' height='30'>" +
        "</a>" +
        "<h3>Lore Ipsum Lae</h3>" );
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