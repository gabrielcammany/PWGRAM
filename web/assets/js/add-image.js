/**
 * Created by Uni on 19/04/2017.
 */
var user_info;

$(function () {
    user_info = JSON.parse(localStorage.getItem('user'));
    console.log(user_info["username"]);
});
$('#addImage').click(function (e) {
   e.preventDefault();
  if(validateImage($('#newImage').attr('src'))&&validateTitle($('#titleImage').val())) {
      var object = {};
      object.image = $('#newImage').attr('src');
      object.title = $('#titleImage').val();
      object.private = $('#private').is(":checked");
      object.public = $('#public').is(":checked");
      object.username = user_info["username"];
      object.userID = user_info["id"];
      var stringData = JSON.stringify(object);

      $.ajax({
          type: 'post',
          url: '/uploadNewImage',
          data: {myData: stringData},
          success: function ($response) {
              //$response = JSON.parse($response);
              console.log('**' + $response);
              status_modal($response);

          }
      });
  }
});

function uploadPicture() {
    $.ajax({
        type: 'POST',
        url: '/upload',
        data: {myData:$('#newImage').attr('src')},
        success: function ($response) {
        }
    });
}
$("#btnSelectImage").change(function(){

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            $('#newImage').attr('src', e.target.result);

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
    if(v1.localeCompare("../assets/img/default/default_user.png") == 0){
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
            /*$.ajax({
                type: 'GET',
                url: '/manel',
                data: ""
            });*/
            window.location.href = "/";
            break;
        default:
            $('.error').addClass('alert alert-danger').html("Error desconocido" + $response);
    }
}