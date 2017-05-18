$('#sortingList li').on('click',function (e) {
    e.preventDefault();
    $('#dropdownButton').html($(this).attr('data-content') +' <span class="caret"></span>');
    var type= $(this).attr('data-content');
    switch (type){
        case 'Recientes':
            $('#galleryComments').css("display", "none");
            $('#galleryLikes').css("display", "none");
            $('#galleryRecents').css("display", "inline-block");

            break;
        case 'Comentarios':
            $('#galleryRecents').css("display", "none");
            $('#galleryLikes').css("display", "none");
            $('#galleryComments').css("display", "inline-block");
            break;
        case 'Likes':
            $('#galleryComments').css("display", "none");
            $('#galleryRecents').css("display", "none");
            $('#galleryLikes').css("display", "inline-block");
            break;
    }
});