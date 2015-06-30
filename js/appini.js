CP = {online: true};
CP.APP_NAME = 'queropizza';
CP.VERSION = '0.0.1';
CP.jsv = Math.ceil(Math.random() * 999999999999999) + 1;

//cookie para debug :
//document.cookie="RDD=RDD; expires=Thu, 18 Dec 2053 12:00:00 UTC";
function isDev() {
    return document.cookie.toString().indexOf('RDD=RDD') > -1;
}

if (isDev()) {
    CP.URL_APP = 'http://127.0.0.1/m_apps/' + CP.APP_NAME + 'w/';
    CP.URL_API = 'http://127.0.0.1/m_apps/' + CP.APP_NAME + 'w/';
    CP.URL_PUB = 'http://127.0.0.1/m_apps/public/' + CP.APP_NAME + '/';
} else {
    CP.URL_API = 'http://200.155.13.171:8080/m_apps/' + CP.APP_NAME + 'w/';
    CP.URL_APP = 'http://200.155.13.171:8080/m_apps/' + CP.APP_NAME + 'w/';
    CP.URL_PUB = 'http://200.155.13.171:8080/m_apps/public/' + CP.APP_NAME + '/';
}
MSG_SEM_NET = "Sua conexão com a internet parece estar desligada. Por favor verifique sua conexão e tente de novo.";


function loadIniScript() {
    loadJsCss(CP.URL_APP + 'js/app.js?v=' + CP.jsv);
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

function loadJsCss(src) {
    var spl = src.split('?')[0];
    var ext = spl.substring(spl.length - 4) == '.css' ? 'css' : 'js';
    src += (src.indexOf('?') === -1 ? '?' : '&') + 'v=' + gen_uuid();
    if (ext == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", src)
    }
    else if (ext == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", src)
    }

    document.getElementsByTagName("head")[0].appendChild(fileref)
}

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
}
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */


/*
 * Take a string and return the hex representation of its MD5.
 */
function md5(str) {
    var x, a, b, c, d, olda, oldb, oldc, oldd;

    /*
     * Convert a 32-bit number to a hex string with ls-byte first
     */
    this.rhex = function(num)
    {
        var hex_chr = "0123456789abcdef";
        var str = "";
        for (j = 0; j <= 3; j++)
            str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                    hex_chr.charAt((num >> (j * 8)) & 0x0F);
        return str;
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    this.add = function(x, y)
    {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left
     */
    this.rol = function(num, cnt)
    {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * These functions implement the basic operation for each round of the
     * algorithm.
     */
    this.cmn = function(q, a, b, x, s, t)
    {
        return this.add(this.rol(this.add(add(a, q), this.add(x, t)), s), b);
    }
    this.ff = function(a, b, c, d, x, s, t)
    {
        return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    this.gg = function(a, b, c, d, x, s, t)
    {
        return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    this.hh = function(a, b, c, d, x, s, t)
    {
        return this.cmn(b ^ c ^ d, a, b, x, s, t);
    }
    this.ii = function(a, b, c, d, x, s, t)
    {
        return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
    }


    /*
     * Convert a string to a sequence of 16-word blocks, stored as an array.
     * Append padding bits and the length, as described in the MD5 standard.
     */
    this.str2blks_MD5 = function(str)
    {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++)
            blks[i] = 0;
        for (i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }


    x = this.str2blks_MD5(str);
    a = 1732584193;
    b = -271733879;
    c = -1732584194;
    d = 271733878;

    for (i = 0; i < x.length; i += 16)
    {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
        b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
        d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = this.add(a, olda);
        b = this.add(b, oldb);
        c = this.add(c, oldc);
        d = this.add(d, oldd);
    }

    return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function gen_uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];

    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (var i = 0;
                i < len;
                i++)
            uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (var i = 0;
                i < 36;
                i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//Verifica se suporta web storage
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function js_utf8_encode(string) {
    return unescape(encodeURIComponent(string));
}

function js_utf8_decode(string) {
    return decodeURIComponent(escape(string));
}

function js_json_utf8_encode(obj) {
    return js_utf8_encode(JSON.stringify(obj));
}

function js_json_utf8_decode(str) {
    return js_utf8_decode(JSON.parse(str));
}

function is_email(str)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return str.match(mailformat);
}

//retirado do sugar_3.js, forms.js (utilizado em get_Form_lanctos,  ajax_funcs.js):
RegExp.escape = function(text)
{
    if (!arguments.callee.sRE)
    {
        var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
        arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    }
    return text.replace(arguments.callee.sRE, '\\$1');
}

function formatNumber(n, dec_sep, round, precision)
{
    precision = Math.round(VR_DECIMAIS);
    if (typeof dec_sep == 'undefined')
        return n;
    n = n.toString();
    if (n.split)
        n = n.split('.');
    else
        return n;
    if (n.length > 2)
        return n.join('.');
    if (typeof round != 'undefined')
    {
        if (round > 0 && n.length > 1)
        {
            n[1] = parseFloat('0.' + n[1]);
            n[1] = Math.round(n[1] * Math.pow(10, round)) / Math.pow(10, round);
            n[1] = n[1].toString().split('.')[1];
        }

        if (round <= 0)
        {
            n[0] = Math.round(parseInt(n[0]) * Math.pow(10, round)) / Math.pow(10, round);
            n[1] = '';
        }
    }

    if (typeof precision != 'undefined' && precision >= 0)
    {
        if (n.length > 1 && typeof n[1] != 'undefined')
            n[1] = n[1].substring(0, precision);
        else
            n[1] = '';
        if (n[1].length < precision)
        {
            for (var wp = n[1].length;
                    wp < precision;
                    wp++)
                n[1] += '0';
        }
    }

    return n[0] + (n.length > 1 && n[1] != '' ? dec_sep + n[1] : '');
}


function js_extract_numbers(str, accept) {
    if (!str || !str.length)
        return str;

    if (!accept)
        accept = '0123456789';

    accept = accept.split('');

    if (typeof str.toString == 'function')
        str = str.toString();

    var len = str.length;

    var ret = '';

    for (var i = 0;
            i < len;
            i++) {
        var strChar = str.charAt(i);
        if ($.inArray(strChar, accept) !== -1)
            ret = ret + strChar;
    }

    return ret;
}


function is_ios() {
    return (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i));
}

function is_wp() {
    return navigator.userAgent.match(/Windows Phone/i);
}

function is_android() {
    return navigator.userAgent.match(/Android/i);
}