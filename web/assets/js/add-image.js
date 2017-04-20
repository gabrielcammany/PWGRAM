/**
 * Created by Uni on 19/04/2017.
 */
$('#addImage').click(function (e) {
   e.preventDefault();
   console.log($('#add_image').val());
   console.log($('#titleImage').val());
   console.log($('#private').val());
   console.log($('#public').val());
   var object={};
   object.image=$('#add_image').val();

    $.ajax({
        type: 'POST',
        url: '/upload',
        data: {myData:$('#add_image').attr('src'),$('#titleImage').val(),},
        success: function ($response) {
            console.log('**'+$response);
        }
    });

});

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            $('#add_image').attr('src', e.target.result);
           /*
            Enviamos la imagen desde el cliente al servidor con un nombre provisional y solo cambiaremos el nombre
            al registrar al usuario.
            */
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: {myData:$('#add_image').attr('src')},
                success: function ($response) {
                    console.log('**'+$response);
                }
            });
        }

    }
}
