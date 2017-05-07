

var $image = $('.img-container > img');
var loaded =   false;
$(function(){

    var imgloaded = $('.loaded');
    imgloaded.hide();
    var imgnoloaded = $('.noloaded');
    imgnoloaded.show();
});


$('#addImage').click(function (e) {
    e.preventDefault();

    if(validateImage($('#newImage').attr('src'))&&validateTitle($('#titleImage').val())) {
        var object = {};
        object.image = $('#newImage').attr('src');
        object.title = $('#titleImage').val();
        object.private = $('#private').is(":checked");
        object.public = $('#public').is(":checked");
        object.data = $image.cropper('getData');
        var stringData = JSON.stringify(object);
        $.ajax({
            type: 'post',
            url: '/uploadNewImage',
            data: {myData: stringData},
            success: function ($response) {
                var status = $response.split('#');
                status_modal($response);
            }
        });
    }
});


$("#inputImage").change(function(){

    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(this.files[0]);
        reader.onload = function (e) {
            if(!loaded){
                $image.cropper({
                    aspectRatio: 1/ 1,
                    viewMode: 2,
                    preview: '.preview',
                    responsive: true,
                    mouseWheelZoom: true,
                    touchDragZoom: true,
                    modal: false,
                    strict: true,
                });
                loaded = true;
                var imgnoloaded = $('.noloaded');
                var imgloaded = $('.loaded');
                imgnoloaded.hide();
                imgloaded.show();
            }
            $image.cropper('replace', e.target.result)
        }

    }
});


function validateTitle(v1) {
    if(!v1){
        $('.error').addClass('alert alert-danger').html("Titulo vacio!");
        return false;
    }else{
        return true;
    }
}

function validateImage(v1) {
    if(v1.localeCompare("") == 0){
        $('.error').addClass('alert alert-danger').html("Selecciona una imagen");

        return false;
    }else{
        return true;
    }
}

function status_modal( $response){
    switch($response){
        case '1':
            $('.error').addClass('alert alert-danger').html("Titulo vacio!");
            break;
        case '2':
            $('.error').addClass('alert alert-danger').html("Selecciona una imagen!");
            break;
        case '3':
            uploadPicture();
            console.log("LLEGO AL 3");
            swal({
                title: "Imagen Añadida",
                type: "success",
                timer:2000,
                showConfirmButton: true
            });
            window.location.href = "/";
            break;
        case 4:
            $('.error').addClass('alert alert-danger').html("Error en subir una imagen!");
            break;
        default:
            $('.error').addClass('alert alert-danger').html("Error desconocido" + $response);
    }
}