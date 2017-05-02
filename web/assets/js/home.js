/**
 * Created by Xps_Sam on 17/04/2017.
 */

$(function(){

    fillGallery('/popular_images','gallery_pop');
    fillGallery('/getRecentImages','gallery_recent');
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
