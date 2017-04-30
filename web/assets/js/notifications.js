/**
 * Created by Gabriel on 24/04/2017.
 */
var mainlist;
var refillTable = false;

$(function() {
    fillTable();
    listeners();
    var $search = $('.fixed-table-toolbar .search input');
    $search.attr('placeholder', 'Busca por aqui!');
});

function listeners() {
    window.actionEvents = {
        'click .remove': function (e, value, row, index) {
            removeNotification(row);
        }
    };
    $('#tableNotifications').on('all.bs.table', function (e, name, args) {
        //console.log('Event:', name, ', data:', args);
    })
        .on('refresh.bs.table', function (e, data) {
            updateTable();
        });

}

function actionFormatter(value, row, index) {
    return [
        '<a class="remove ml10" href="javascript:void(0)" title="Eliminar">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

function imglink(value, row, index) {
    return [
        '<a class="imgNotification linkText" href="/image/'+value+'" title="Imagen">'
         +value+
        '</a>',
    ].join('');
}
function userlink(value, row, index) {
    return [
        '<a class="userNotification linkText" href="/profile/'+value+'" title="Usuario">'
        +value+
        '</a>',
    ].join('');
}

function fillTable() {
    $.ajax({
        type: 'post',
        url: '/getUserNotifications',
        data: {"dropdown": 0},
        success: function (response) {
            list = (JSON).parse(response);
            list_aux = (JSON).parse(response);
            if(list.length != 0) {
                for (var i = 0; i < list.length; i++) {
                    var startDate = new Date();
                    var actual = new Date(list[i].created_at);
                    var seconds = (startDate.getTime() - actual.getTime()) / 1000;
                    var minutes = seconds / 60;
                    var hours = seconds / 3600;
                    var days = seconds / 86400;

                    if (days >= 1) {
                        if (days == 1) {
                            var time = Math.floor(days) + " día";
                        } else {
                            var time = Math.floor(days) + " días";
                        }
                    } else if (hours >= 1) {
                        if (hours == 1) {
                            var time = Math.floor(hours) + " hora";
                        } else {
                            var time = Math.floor(hours) + " horas";
                        }
                    } else if (minutes >= 1) {
                        if (minutes == 1) {
                            var time = Math.floor(minutes) + " minuto";
                        } else {
                            var time = Math.floor(minutes) + " minutos";
                        }
                    } else {
                        if (seconds == 1) {
                            var time = Math.floor(seconds) + " segundo";
                        } else {
                            var time = Math.floor(seconds) + " segundos";
                        }
                    }
                    list[i].created_at = time;
                    list_aux[i].created_at = time;
                    if (list[i].event_id == 1) {
                        list[i].event_id = "Like"
                    } else {
                        list[i].event_id = "Comentario"
                    }
                    list[i].post_id = ((list[i].post_id).split("_"))[1];
                }
                mainlist = list;
                if(refillTable){
                    $('#tableNotifications').bootstrapTable("load", mainlist);
                    $("#tableNotificationsList").html("");
                    addNotifications(list_aux,true);
                }else{
                    $('#tableNotifications').bootstrapTable({
                        data: mainlist,
                        formatNoMatches: function () {
                            return 'No tienes ninguna notificación';
                        }
                    });
                }
            }else{
                $('#tableNotifications').bootstrapTable({
                    formatNoMatches: function () {
                        return 'No tienes ninguna notificación';
                    }
                });
            }
        }
    });
}

function updateTable() {
    $.ajax({
        type: 'post',
        url: '/getNumNotifications',
        success: function ($response) {
            var num = (JSON.parse($response))[0]["COUNT(id)"];
            var numberNotification = $('#notificationNumber');
            numberNotification.text(num);
            refillTable = true;
            fillTable();
        }
    });
}

function removeNotification(row){
    $.ajax({
        type: 'post',
        url: '/notificationSeen',
        data: {index:row["id"]},
        success: function ($response) {
            var numberNotification = $('#notificationNumber');
            numberNotification.text(mainlist.length-1);
            if (mainlist.length != 1){
                refillTable = true;
                fillTable();
            }else{
                numberNotification.hide();
                var noNotification = $('#noNotification');
                noNotification.show();
                $('#tableNotifications').bootstrapTable('removeAll');
            }
        }
    });
}