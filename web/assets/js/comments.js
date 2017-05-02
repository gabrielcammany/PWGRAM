/**
 * Created by Gabriel on 24/04/2017.
 */
var mainlist;
var refillTable = false;


$(function() {
    fillTable();
    listeners();
});

function listeners() {
    window.actionEvents = {
        'click .remove': function (e, value, row, index) {
            removeComment(row);
        }
    };
    $('#tableComments').on('all.bs.table', function (e, name, args) {
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
        '<a class="imgComment linkText" href="/image/'+(value.split("_"))[0]+'" title="Imagen">'
         +(value.split("_"))[1]+
        '</a>',
    ].join('');
}
function userlink(value, row, index) {
    return [
        '<a class="userComment linkText" href="/profile/'+value+'" title="Usuario">'
        +value+
        '</a>',
    ].join('');
}

function fillTable() {
    $.ajax({
        type: 'post',
        url: '/getUserComments',
        success: function ($response) {
            list = (JSON).parse($response);
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
                }
                mainlist = list;
                if(refillTable){
                    $('#tableComments').bootstrapTable("load", mainlist);
                    var $search = $('.fixed-table-toolbar .search input');
                    $search.attr('placeholder', 'Busca Comentarios!');
                }else{
                    $('#tableComments').bootstrapTable({
                        data: mainlist,
                        formatNoMatches: function () {
                            return 'No tienes ningun comentario';
                        }
                    });
                    var $search = $('.fixed-table-toolbar .search input');
                    $search.attr('placeholder', 'Busca Comentarios!');
                }
            }else{
                $('#tableComments').bootstrapTable({
                    formatNoMatches: function () {
                        return 'No tienes ningun comentario';
                    }
                });
                var $search = $('.fixed-table-toolbar .search input');
                $search.attr('placeholder', 'Busca Comentarios!');
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
            var numberNotification = $('#commentNumber');
            numberNotification.text(num);
            refillTable = true;
            fillTable();
        }
    });
}

function removeComment(row){
    $.ajax({
        type: 'post',
        url: '/commentRemove',
        data: {index:(row.image_id.split("_"))[0]},
        success: function ($response) {
            var res = JSON.parse($response);
            if(res.length == 0){
                if (mainlist.length != 1){
                    refillTable = true;
                    fillTable();
                }else{
                    $('#tableComments').bootstrapTable('removeAll');
                }
            }
        }
    });
}