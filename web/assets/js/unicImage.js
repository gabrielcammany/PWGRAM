$(function() {
    console.log('##'+$('#main_image').attr('alt'));
    $.ajax({
        type: 'post',
        url: '/getInfoImage',
        data: {id: $('#main_image').attr('alt')},
        success: function ($response) {

                if($response!=0) {
                    $image = JSON.parse($response);
                    console.log($image);
                    var array = $image[0].img_path.split('/');
                    var path = $image[0].img_path.split('.');
                    $('#main_image').attr('src', '../'+$image[0].img_path);
                    $('#content').append("<h2><span>" + $image[0].title + "</span></h2>" +
                        "<p><h2><A href='/profile/" + array[3] + "' id='link_username'>" + array[3] + "</A></h2></p>" +
                        "<p id='label_like'>Likes: " + $image[0].likes + "</p>");
                }
            }

    });
});