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

//decimal de db (divisor ".") para visualizacao
function toPreco(number) {
    var str = number + '', nstr = '', spl = [];

    if (str.indexOf('.') === -1) {
        nstr = str + ',00';
    } else {
        spl = str.split('.');
        nstr = spl[0];
        switch (spl[1].length) {
            case 1 :
                nstr += ',' + spl[1] + '0';
                break;
            case 2 :
                nstr += ',' + spl[1];
                break;
            default :
                nstr += ',' + spl[1].substring(0, 2);
                break;
        }
    }

    return nstr;
}

//precisa dessa funcao pois multiplicar 2.4 * 3 = 7.19999 no javascript (floating point rounding error)
function multiplyPreco(preco, qtde) {
    return parseFloat((preco * qtde).toFixed(2));
}