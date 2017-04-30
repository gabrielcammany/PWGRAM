$(function() {

    $.ajax({
        type: 'post',
        url: '/getInfoImage',
        data: {id: $('#main_image').attr('alt')},
        success: function ($response) {
            console.log('##'+$response);
                if($response!=0) {
                    $image = JSON.parse($response);
                    console.log($image);
                    var array = $image[0].img_path.split('/');
                    var path = $image[0].img_path.split('.');
                    $('#main_image').attr('src', '../'+$image[0].img_path);
                    $('#content').append("<h2 id='title'>" + $image[0].title + "</h2>" +
                        "<p><h2><A href='/profile/" + array[3] + "' id='link_username'>" + array[3] + "</A></h2></p>" +
                        "<p id='label_like'>Likes: " + $image[0].likes + "</p>");
                }
            }

    });
});

$('#deleteImage').on('click',   function(){
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
            $.ajax({
                type: 'post',
                url: '/deleteImage',
                data: {id: $('#main_image').attr('alt')},
                success: function ($response) {
                    console.log('##'+$response);
                    if($response!=0) {
                        $image = JSON.parse($response);
                        console.log($image);
                        swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    }
                }

            });
    });
});
