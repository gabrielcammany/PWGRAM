$(function() {


    $.ajax({
        type: 'post',
        url: '/getProfileImages',
        data: {myData: $('#userName').attr('data-content')},
        success: function ($response) {

            $images = JSON.parse($response);
            for (var i_image in $images){
                var array = $images[i_image].img_path.split('/');
                var path = $images[i_image].img_path.split('.');

                $('#gallery').append("<div class='col-md-4 portfolio-item'>" +
                    "<figure class='snip0016'><img class='img-responsive img_profile' src='../"+path[0]+"_400.jpg' alt=''/>" +
                    "<figcaption> <h2><span>"+$images[i_image].title+"</span></h2><p><h2><A href='/profile/"+array[3]+"' id='link_username'>"+array[3]+"</A></h2></p><p id='label_like'>Likes: "+$images[i_image].visits+"</p></figcaption></figure>" +
                    "<div class='buttons_icons' align='center'>" +
                    "<a class='btn btn-simple btn-just-icon'>" +
                    "<img src='../assets/img/icons/like.png' id='"+i_image+"' width='30' height='30'>" +
                    "</a><a class='btn btn-simple btn-just-icon' >" +
                    "<img src='../assets/img/icons/comments.png' id='"+i_image + i_image+"' width='30' height='30'>" +
                    "</a></div>");
/*
                 $('#gallery').append("<div class='col-md-4 portfolio-item'><a href='#'><div class='img-wrapper'>" +
                    "<img class='img-responsive img_profile' src='../"+path[0]+"_400.jpg' alt=''" +
                    "</div></a>" +
                    "<div id='text'><p id='likes'>Esto es una prueba</p></div>" +
                    "<div class='buttons_icons'>" +
                    "<a class='btn btn-simple btn-just-icon'>" +
                    "<img src='../assets/img/icons/like.png' id='"+i_image+"' width='30' height='30'>" +
                    "</a><a class='btn btn-simple btn-just-icon' >" +
                    "<img src='../assets/img/icons/comments.png' id='"+i_image + i_image+"' width='30' height='30'>" +
                    "</a></div>" +
                    "<a href='/profile/"+array[3]+"' id='link_username'><h3 id='username'>"+array[3]+"</h3></a>" +
                    "<h3>"+$images[i_image].title+"</h3>" );
*/
                    $("#"+i_image).on('click',{index:i_image},function(e){
                            console.log('title: ',$images[e.data.index].title);
                            if($('#'+e.data.index).attr('src')=='../assets/img/icons/like.png'){
                                //console.log('0--> ',e.data.path);
                                $.ajax({
                                    type: 'post',
                                    url: '/incLike',
                                    data: {"path":$images[e.data.index].img_path},
                                    success: function ($response) {
                                        $('#'+e.data.index).attr('src','../assets/img/icons/like_filled.png');
                                        console.log(JSON.parse($response)['likes']);
                                    }
                                });
                            } else {
                                $.ajax({
                                    type: 'post',
                                    url: '/removeLike',
                                    data: {"path":$images[e.data.index].img_path},
                                    success: function ($response) {
                                        $('#'+e.data.index).attr('src','../assets/img/icons/like.png');
                                        //console.log(JSON.parse($response)['likes']);
                                    }
                                });
                    }
                });

            }
        }
    });
});

$('.img_profile').mouseover(function() {
    $('#likes').show();
    //$('#likes').css("visibility","visible");
});

$('.img_profile').mouseout(function() {

    $('#likes').hidde();
});