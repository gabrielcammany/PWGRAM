/**
 * Created by Gabriel on 24/04/2017.
 */

$(function() {
    $.ajax({
        type: 'post',
        url: '/getUserNotifications',
        data: {"dropdown": 0},
        success: function (response) {
            var holas = (JSON).parse(response);
            console.log(JSON.stringify(holas));
            $('#tableNotifications').bootstrapTable({
                data: holas
            });
        }
    });


});
