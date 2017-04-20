/**
 * Created by Xps_Sam on 17/04/2017.
 */


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

/*
 Funció encarregada de llegir la url introduida per l'usuari i carregar la foto de perfil seleccionada
 */
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            $('#perfil_reg').attr('src', e.target.result);
            /*
             Enviamos la imagen desde el cliente al servidor con un nombre provisional y solo cambiaremos el nombre
             al registrar al usuario.
             */
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: {myData:$('#perfil_reg').attr('src')},
                success: function ($response) {
                    console.log('**'+$response);
                }
            });
        }

    }
}
/*
 Funció que espera a que el usuari realitzi algun canvi en el input per poder cridar a la funció encarregada
 de realitzar el canvi de la imatge de defecte per la seleccionada.
 */
$("#btnSelectImage").change(function(){
    readURL(this);
    img_path=1;
});