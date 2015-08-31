CP = {online: true};
CP.APP_NAME = 'queropizza';
CP.VERSION = '0.0.2';
CP.jsv = Math.ceil(Math.random() * 999999999999999) + 1;

if (window.location.href.indexOf('desktop=on') !== -1) {
    localStorage.setItem('destktop_version', 1);
} else if (window.location.href.indexOf('desktop=off') !== -1) {
    localStorage.removeItem('destktop_version');
}
if (localStorage.getItem('destktop_version') != 1) {
    CP.URL_APP = 'http://m.multidadosti.com.br/m_apps/queropizzaw/';
} else {
    CP.URL_APP = 'http://' + window.location.host + '/m_apps/queropizzaw/';
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
    if (typeof navigator == 'undefined' || typeof navigator.connection == 'undefined')
        return true;

    //nova API (direto em navigator.connection)
    if (typeof navigator.connection != 'undefined'
            && typeof navigator.connection.type != 'undefined'
            && navigator.connection.type == Connection.NONE)
        return false;

    return true;
}

function onDeviceready() {
    CP.deviceready = true;
    //https://github.com/apache/cordova-plugin-network-information/blob/df7aac845dc7deddbdb76e89216776a802ee8b67/doc/index.md
    //Applications typically should use document.addEventListener to attach an event listener once the deviceready event fires.
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
}

function onOnline() {
    if (typeof CP.offline_warn_to != 'undefined') {
        window.clearTimeout(CP.offline_warn_to);
    }
    if (!CP.online) {
        if (typeof jqm_rendered == 'function' && jqm_rendered())
            $.mobile.loading('hide');
    }
    CP.online = true;
}

function onOffline() {
    if (typeof CP.offline_warn_to != 'undefined') {
        window.clearTimeout(CP.offline_warn_to);
    }

    CP.offline_warn_to = window.setTimeout(function() {

        CP.online = false;

        if (typeof jqm_rendered == 'function' && jqm_rendered())
            $.mobile.loading('show', {
                text: etext,
                textVisible: true,
                theme: 'b'
            });
        else
            alert(MSG_SEM_NET);
    }, 5000)

}

document.addEventListener("deviceready", onDeviceready, false);

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
                    if (typeof navigator.splashscreen == 'object') {
                        navigator.splashscreen.hide();
                    }
                    $('#divsemnet').remove();
                    $('body').append('<div id="divsemnet" style="font-family:Arial">' + MSG_SEM_NET + '</div>');
                }
            }
        }, 1000);
    }
});
