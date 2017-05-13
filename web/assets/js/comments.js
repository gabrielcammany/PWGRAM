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
        },
        'click .edit': function (e, value, row, index) {
            console.log(row);
            openEditModal(row);
            //listenerChange(row,index);
            $('#changeComment').on('click',function (e) {
                e.preventDefault();

                var object = Object();
                object.comment = $('#comentario').val();
                object.id = $('#comentario').attr('data-content');

                $.ajax({
                    type: 'post',
                    url: '/commentedit',
                    data: {myData: JSON.stringify(object)},
                    success: function ($response){
                        console.log(index);
                        $response = JSON.parse($response);
                        status_modal($response,row,index);
                    }
                });
            });
        }
    };
    $('#tableComments').on('all.bs.table', function (e, name, args){
    })
        .on('refresh.bs.table', function (e, data) {
                updateTable();
        });

}

function actionFormatter(value, row, index) {
    return [
        '<a class="remove ml10" href="javascript:void(0)" title="Eliminar">',
        '<i class="glyphicon glyphicon-trash"></i>',
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

function editlink(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="Editar">',
        '<i class="glyphicon glyphicon-edit"></i>',
        '</a>'
    ].join('');
}

function fillTable() {
    $.ajax({
        type: 'post',
        url: '/getUserComments',
        success: function ($response) {
           // console.log($response);
            list = (JSON).parse($response);
            if(list.length != 0) {
                for (var i = 0; i < list.length; i++) {
                    var time = getTimeDifference(list[i].created_at);
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
            if (mainlist.length != 1){
                refillTable = true;
                fillTable();
            }else{
                $('#tableComments').bootstrapTable('removeAll');
            }
        }
    });
}

function openEditModal(row){
    showEditForm(row);
    setTimeout(function(){
        $('#editComments').modal('show');
    }, 230);

}
function showEditForm(row){
    $('#editComments').fadeIn('fast');
    $('#comentario').val(row.text);
    $('#comentario').attr('data-content',row.id);
    $('.modal-title').html('Editar comentario');
    $('.error').removeClass('alert alert-danger').html('');
}

function listenerChange(row,index) {
    $('#changeComment').on('click',function (e) {
        e.preventDefault();

        var object = Object();
        object.comment = $('#comentario').val();
        object.id = $('#comentario').attr('data-content');

        $.ajax({
            type: 'post',
            url: '/commentedit',
            data: {myData: JSON.stringify(object)},
            success: function ($response){
                $response = JSON.parse($response);
                status_modal($response,row,index);
            }
        });
    });
}


function status_modal($response,row,index){
    switch($response['result']){
        case 0:
            $('.error').addClass('alert alert-danger').html("Error! No se ha podido editar el comentario");
            break;
        case 1:
           /* row.text = $('#comentario').val();
            $('#tableComments').bootstrapTable("updateRow", {index: index,row: row});*/
            $('#close_modal').click();
            refillTable = true;
            fillTable();
            break;
        case 2:
            $('.error').addClass('alert alert-danger').html("Error! El comentario es el mismo" + $response['error']);
            break;
        default:
            $('.error').addClass('alert alert-danger').html("Error desconocido" + $response);
            break;
    }
}

