var $image;

$(function() {

    $.ajax({
        type: 'post',
        url: '/getInfoImage',
        data: {id: $('#main_image').attr('alt')},
        success: function ($response) {
           // console.log('##'+$response);
                if($response!=0) {
                    $image = JSON.parse($response);
                 //   console.log($image);
                    var array = $image[0].img_path.split('/');
                    var path = $image[0].img_path.split('.');
                    $('#main_image').attr('src', '../'+$image[0].img_path);
                    $('#content').prepend("<h2 id='title'>" + $image[0].title + "</h2>" +
                        "<p><h2><A href='/profile/" + array[3] + "' id='link_username'>" + array[3] + "</A></h2></p>" +
                        "<p id='label_like'>Likes: " + $image[0].likes + "</p>");
                }
            }

    });
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

$('#editImage').on('click',function(e){
    e.preventDefault();
    $('#formEditImage').show();
    $('#title_input').val($image[0].title);
    if($image[0].private == 0){
        $('#public').attr('checked',true);
    }else{
        $('#private').attr('checked',true);
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