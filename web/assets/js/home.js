/**
 * Created by Xps_Sam on 17/04/2017.
 */

$(function(){

    //fillGallery('/popular_images','gallery_pop');
    //fillGallery('/getRecentImages','gallery_recent');
    /*var max = $('#gallery_pop').attr('data-content');
    var i;
    for(i=0;i<max;i++){
        var aux=$('#link_image_1').attr('src');
        console.log(aux);
        var array = aux.split('/');
        $('#username_title_'+i).text(array[3]);
        $('#link_username_'+i).attr('href','/profile/'+array[3]);
    }
*/
    //setCommentListenerImage(i_image,idTag,$images)
});
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

$('#gallery_pop img').on('click',function(e){
    e.preventDefault();
    console.log($(this).attr('data-content'));
    setLikeListenerImage(this,$(this).attr('data-content'),$(this).attr('data-content'));
});

$('#gallery_recent img').on('click',function(e){
    e.preventDefault();
    console.log($(this).attr('data-content'));
    setLikeListenerImage(this,$(this).attr('data-content'),$(this).attr('data-content'));
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