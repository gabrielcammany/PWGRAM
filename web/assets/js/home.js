/**
 * Created by Xps_Sam on 17/04/2017.
 */
var popular = 5;
var recent = 5;
$(function(){

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

$('#add5MorePopular').on('click',function (e) {
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/getFiveMorePop',
        data: {myData: recent},
        success: function (result) {
            console.log((result));
            $('#gallery_pop').append(result);
        }
    })
});