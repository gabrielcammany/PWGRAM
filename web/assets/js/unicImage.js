
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
                data: {id: $('#main_image').attr('data-content')},
                success: function ($response) {
                    console.log($response);
                    if($response.length !=0) {
                        main_image = JSON.parse($response);
                        swal("Deleted!", "Su imagen ha sido eliminada.", "success");
                        window.location='../';
                    }else{
                        swal("Not Deleted!", "El path especificado no se encuentra.", "error");
                    }
                }
            });
        });
});

$('#editImage').on('click',function(e){
    e.preventDefault();
    openEditModal();
});
$('#updateImage').click(function (e) {
    e.preventDefault();
    if(validateTitle($('#titleImage').val())) {
        var object = {};
        object.id_image = $('#main_image').attr('data-content');
        object.title = $('#titleImage').val();
        object.private = $('#private').is(":checked");
        object.public = $('#public').is(":checked");
        var stringData = JSON.stringify(object);
        console.log('@@@ '+stringData+' @@@');
        $.ajax({
            type: 'post',
            url: '/editImageInfo',
            data: {myData: stringData},
            success: function ($response) {
                var result = JSON.parse($response);
                switch(result['result']){
                    case 0:
                        $('.error').addClass('alert alert-danger').html("Error en actualizar la informacion");
                        break;
                    case 1:
                        $('.error').addClass('alert alert-danger').html("Titulo incorrecto");
                        break;
                    case 2:
                        swal({
                            title: "Actualizada!",
                            type: "success",
                            timer:2000,
                            showConfirmButton: false
                        });
                        $('#close_modal').click();
                        window.location = "/profile/"+result['username'];
                        break;
                    default:
                        $('.error').addClass('alert alert-danger').html("Error desconocido");
                        break;
                }

            }
        });
    }else{
        $('.error').addClass('alert alert-danger').html("Titulo incorrecto");
    }
});

$('#saveChanges').on('click',function(e){
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/editImageInfo',
        data: {myData: $('#formEditImage').serializeArray()},
        success: function ($response) {
            console.log('##'+$response);
        }

    });
});

function showEditForm(){
    $('#edit_modal').fadeIn('fast');
        $('.modal-title').html('Editar imagen');

    $('.error').removeClass('alert alert-danger').html('');
}

function openEditModal(){
    showEditForm();
    setTimeout(function(){
        $('#edit_modal').modal('show');
    }, 230);

}

function validateTitle(v1) {
    if(!v1){
        $('.error').addClass('alert alert-danger').html("Titulo vacio!");
        return false;
    }else{
        return true;
    }
}