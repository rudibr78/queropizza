CP = {online: true};
CP.APP_NAME = 'queropizza';
CP.VERSION = '0.0.1';
CP.jsv = Math.ceil(Math.random() * 999999999999999) + 1;

function _GET(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

if (_GET('desktop') == 'on') {
    forcedestktopoff = false;
    document.cookie = "appdesktopver=1; expires=Thu, 18 Dec 2053 12:00:00 UTC";
} else if (_GET('desktop') == 'off') {
    forcedestktopoff = true;
    document.cookie = "appdesktopver=1; expires=Thu, 18 Dec 2000 12:00:00 UTC";
}
//cookie para debug :
//document.cookie="RDD=RDD; expires=Thu, 18 Dec 2053 12:00:00 UTC";
function isDev() {
    return document.cookie.toString().indexOf('RDD=RDD') > -1;
}

function is_mobile() {
    return forcedestktopoff || document.cookie.toString().indexOf('appdesktopver=1') === -1;
}

if (is_mobile()) {
    CP.URL_APP = 'http://m.multidadosti.com.br/m_apps/' + CP.APP_NAME + 'w/';
} else {
    CP.URL_APP = 'http://' + window.location.host + '/m_apps/' + CP.APP_NAME + 'w/';
}

MSG_SEM_NET = "Sua conexão com a internet parece estar desligada. Por favor verifique sua conexão e tente de novo.";

function loadIniScript() {
    var src = CP.URL_APP + 'js/app.js';
    src += '?v=' + CP.jsv;

    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", src);

    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function app_connected() {
    if (typeof navigator == 'undefined' || typeof Connection == 'undefined')
        return true;

    //API antiga (com .network.)
    if (typeof navigator.network != 'undefined'
            && typeof navigator.network.connection != 'undefined'
            && typeof navigator.network.connection.type != 'undefined'
            && navigator.network.connection.type == Connection.NONE)
        return false;

    //nova API (direto em navigator.connection)
    if (typeof navigator.connection != 'undefined'
            && typeof navigator.connection.type != 'undefined'
            && navigator.connection.type == Connection.NONE)
        return false;

    return true;
}

$(function() {
    var wait_one_int = true;
    if (app_connected()) {
        loadIniScript();
    } else {
        window.init_interval = window.setInterval(function() {
            if (app_connected()) {
                window.clearInterval(window.init_interval);
                loadIniScript();
            } else {
                if (wait_one_int) {
                    wait_one_int = false;
                } else {
                    $('#divsemnet').remove();
                    $('body').append('<div id="divsemnet" style="font-family:Arial">' + MSG_SEM_NET + '</div>');
                }
            }
        }, 1000);
    }
});
