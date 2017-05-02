$(function() {


    fillGallery('/getProfileImages','gallery');

});

$('.img_profile').mouseover(function() {
    $('#likes').show();
    //$('#likes').css("visibility","visible");
});

$('.img_profile').mouseout(function() {

    $('#likes').hidde();
});