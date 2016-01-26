APP_ONLINE = true;
APP_OFFLINE_WARN_TO = false;
APP_INIT_INTERVAL = false;

MSG_SEM_NET = "Este aplicativo precisa de internet. Por favor verifique sua conexão e tente de novo.";

if (window.location.href.indexOf('dev=on') !== -1) {
    localStorage.setItem('dev_version', 1);
} else if (window.location.href.indexOf('dev=off') !== -1) {
    localStorage.removeItem('dev_version');
}

APP_FW = '';

function app_url() {
    var fw = APP_FW ? APP_FW + '/' : '';
    if (localStorage.getItem('dev_version') != 1) {
        return 'http://m.multidadosti.com.br/m_apps/queropizzaw/' + fw;
    } else {
        return 'http://' + window.location.host + '/m_apps/queropizzaw/' + fw;
    }
}

function api_url() {
    if (localStorage.getItem('dev_version') != 1) {
        return 'http://m.multidadosti.com.br/m_apps/queropizzaw/api_entrypoint.php';
    } else {
        return 'http://' + window.location.host + '/m_apps/queropizzaw/api_entrypoint.php';
    }
}

function splash_show() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.show();
    }
}

function splash_hide() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.hide();
    }
}

function gen_uid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

function clog() {
    for (var arg = 0; arg < arguments.length; ++arg) {
        if (typeof arguments[arg] == 'object') {
            console.dir(arguments[arg]);
        } else {
            console.log(arguments[arg]);
        }
    }
}

function nalert(message, title, buttonName, alertCallback) {
    if (!title)
        title = '';

    if (!buttonName)
        buttonName = 'OK';

    if (typeof navigator == 'undefined' ||
            typeof navigator.notification == 'undefined' ||
            typeof navigator.notification.alert != 'function') {
        alert(message);
    } else {
        navigator.notification.alert(message, alertCallback, title, buttonName)
    }
}

function hide_div_sem_net() {
    if (document.getElementById('divsemnet')) {
        document.body.removeChild(document.getElementById('divsemnet'));
    }
}

function show_div_sem_net() {
    hide_div_sem_net();

    var div = document.createElement('div');
    div.id = 'divsemnet';
    div.style.fontFamily = 'Arial';
    div.innerHTML = MSG_SEM_NET
            + '<br><center>'
            + '<img src="app_res/images/icons/sem_net.png">'
            + '</center>';

    document.body.appendChild(div);
}

function loadIniScript() {
    var resource = document.createElement('script')
    resource.setAttribute('type', 'text/javascript')
    resource.setAttribute('src', app_url() + 'app_loader.js' + '?v=' + gen_uid())
    document.getElementsByTagName('head')[0].appendChild(resource);
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


function onOnline() {
    if (APP_OFFLINE_WARN_TO !== false) {
        window.clearTimeout(APP_OFFLINE_WARN_TO);
    }
    if (!APP_ONLINE) {
        //$.mobile.loading('hide');
    }
    APP_ONLINE = true;
}

function onOffline() {
    if (typeof APP_OFFLINE_WARN_TO !== false) {
        window.clearTimeout(APP_OFFLINE_WARN_TO);
    }

    APP_OFFLINE_WARN_TO = window.setTimeout(function() {

        APP_ONLINE = false;

        //verificar se ja esta sendo mostrada a msg de "sem net"
        if (!document.getElementById('divsemnet')) {
            nalert(MSG_SEM_NET, 'Sem conexão');
        }
    }, 5000)
}

function startApp() {
    var wait_one_int = true;
    if (app_connected()) {
        loadIniScript();
    } else {
        APP_INIT_INTERVAL = window.setInterval(function() {
            if (app_connected()) {
                window.clearInterval(APP_INIT_INTERVAL);
                loadIniScript();
            } else {
                if (wait_one_int) {
                    wait_one_int = false;
                } else {
                    splash_hide();
                    show_div_sem_net();
                }
            }
        }, 1000);
    }
}

function onDeviceready() {
    //wp8 nao tem window.alert nativo
    if (typeof window.alert == 'undefined' &&
            typeof navigator != 'undefined' &&
            typeof navigator.notification != 'undefined' &&
            typeof navigator.notification.alert == 'function')
        window.alert = navigator.notification.alert;

    //https://github.com/apache/cordova-plugin-network-information/blob/df7aac845dc7deddbdb76e89216776a802ee8b67/doc/index.md
    //Applications typically should use document.addEventListener to attach an event listener once the deviceready event fires.
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    startApp();
}

//o event onDeviceready soh existe em mobile/cordova
//!!window.cordova resolve true se for cordova
if (!!window.cordova) {
    document.addEventListener("deviceready", onDeviceready, false);
} else {
    onDeviceready();
}

