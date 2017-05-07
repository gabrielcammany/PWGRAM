/**
 * Created by Gabriel on 24/04/2017.
 */

function preparePage($response) {
    var title = $('#validateText');
    var description = $('#descriptionText');
    switch($response){
        case 0:
            title.append("<h3 class=\"title\">Este usuario no existe!</h3>")
            description.append("<a href=\"/\"><p>¿Estas seguro de que no te has equivocado de link?...</p></a>")
            break;
        case 1:
            title.append("<h3 class=\"title\">La cuenta ya esta activada!</h3>")
            description.append("<p>Tu usuario ya ha confirmado la cuenta :)</p>")
            description.append("<a href=\"/\"><p>Aprieta aqui y empieza a disfrutar de PwGram!</p></a>")
            break;
        case 2:
            title.append("<h3 class=\"title\">El token de validación no es correcto... :(</h3>")
            description.append("<a href=\"/\"><p>¿Estas seguro de que no te has equivocado de link?...</p></a>")
            break;
        case 3:
            title.append("<h3 class=\"title\">Tu cuenta ha sido validada correctamente, enhorabuena!</h3>")
            description.append("<a href=\"/\"><p>Aprieta aqui y empieza a disfrutar de PwGram!</p></a>")
            break;
        default:
            title.append("<h3 class=\"title\">Ups, ha habido un error desconocido :0</h3>")
            description.append("<a href=\"/\"><p>Codigo del error: "+$response+"</p></a>")
            break;
    }
}
