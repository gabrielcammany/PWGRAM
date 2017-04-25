$(function() {

    $.ajax({
        type: 'post',
        url: '/getProfileImages',
        data: {myData: $('#btnEditProfile').getAttribute('name')},
        success: function ($response) {
            //Determinar resposta server
            status_modal($response);
            //Evitar que es fasci shake quan es registra.
            if($response!=1)shakeModalRegistration();
        }
    });
});