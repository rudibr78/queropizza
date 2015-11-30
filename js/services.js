angular.module('pizza.services', ['ngResource'])
        .factory('Session', function($resource) {
            return $resource('http://localhost:5000/sessions/:sessionId');
        });

app.service('PizzariaService', function(cfg, $http, $q, $ionicLoading, localStorageService) {
    this.get_dados_pizzaria = function(codpizzaria) {
        return $http({
            method: 'GET'
            , url: cfg.backend
            , params: {m: 'getUidEstab', codigo: codpizzaria}
            , cache: false
        }).finally(function(res) {
            $ionicLoading.hide();
            clog('finally');
            return res;
        }).then(function(res) {

            clog('get_dados_pizzaria success');
            localStorageService.set('uid_estab', res.data.uid_estab);
            localStorageService.set('estab', res.data.estab);

            return res;

        }, function(res) {
            clog('get_dados_pizzaria reject', res);
            // something went wrong
            return $q.reject(res);
        });
    };

    this.get_item_prop = function(idcardapio_item, prop) {
        var estab = localStorageService.get('estab');

        for (i = 0; i < estab.cardapios_itens.length; i++)
            if (estab.cardapios_itens[i].idcardapio_item == idcardapio_item)
                return estab.cardapios_itens[i][prop];

        return '';
    };

    this.get_itens_cardapio = function(idcardapio) {

        var i = 0
                , item
                , last_divider = false
                , divider = false
                , mock_item = {}
        , estab = localStorageService.get('estab')
                , itens = [];

        for (i = 0; i < estab.cardapios_itens.length; i++) {
            item = estab.cardapios_itens[i];
            if (item.idcardapio != idcardapio)
                continue;

            divider = item.descricao_categoria;

            if (last_divider === false || divider !== last_divider) {
                mock_item = angular.copy(item);
                mock_item.divider = true;
                mock_item.nome_item = item.descricao_categoria;
                mock_item.descricao = null;
                mock_item.preco = null;
                i--;
                last_divider = divider;

                itens.push(mock_item);
            } else {
                item.divider = false;

                itens.push(item);
            }
        }
        clog('get_itens_cardapio', itens);
        return itens;

    }
    /*
     this.searchGoats = function(query) {
     return $http.get('/goats/search/' + query);
     };
     
     this.getGoats = function() {
     return $http.get('/goats');
     };
     
     this.getGoat = function(name) {
     return $http.get('/goat/' + name);
     };
     */
})


app.service('PedidoService', function(cfg, $http, $q, $ionicLoading, PizzariaService) {
    this.itens = [];
    this.preco = 0;
    this.formas_pagto = {};

    //sorteia os itens para botar pizzas em primeiro
    this._get_sorted_itens = function() {
        var sorted_itens = [];
        for (var i = 0; i < this.itens.length; i++) {
            if (PizzariaService.get_item_prop(this.itens[i].idcardapio_item, 'cod_cardapio') == 'P') {
                sorted_itens.push(this.itens[i]);
            }
        }
        for (var i = 0; i < this.itens.length; i++) {
            if (PizzariaService.get_item_prop(this.itens[i].idcardapio_item, 'cod_cardapio') != 'P') {
                sorted_itens.push(this.itens[i]);
            }
        }
        return sorted_itens;
    }

    //verifica se o item ja foi adicionado
    this._item_added = function(idcardapio_item) {
        for (var i = 0; i < this.itens.length; i++) {
            if (this.itens[i].idcardapio_item == idcardapio_item)
                return true;
        }
        return false;
    }

    this.add_item = function(idcardapio_item) {
        if (this._item_added(idcardapio_item)) {
            clog('srv add_item ja adicionado = ' + idcardapio_item, this)
            return;
        }
        this.itens.push({
            idcardapio_item: idcardapio_item
            , qtde: 1
        });
        clog('srv add_item', this)
    }

    this.get_itens_grid_pedido = function() {
        var ret = {itens: [], total: {itens: this.itens.length, preco: 0}}
        , item = {}
        , itens = this._get_sorted_itens()
                , preco_item = 0
                ;

        for (var i = 0; i < this.itens.length; i++) {
            item = itens[i];
            item.item_desc = this._get_itens_desc(item);
            preco_item = multiplyPreco(PizzariaService.get_item_prop(item.idcardapio_item, 'preco'), item.qtde);
            item.preco_desc = preco_item;
            ret.total.preco += preco_item;

            ret.itens.push(item);
        }
        return ret;
    }

    this._get_itens_desc = function(item_dets) {
        var html = '';
        if (typeof item_dets.cod_cardapio == 'undefined' || !item_dets.cod_cardapio) {
            return PizzariaService.get_item_prop(item_dets.idcardapio_item, 'nome_item');
        }

        switch (item_dets.cod_cardapio) {
            case 'P' :
                html += "Pizza ";
                //html += PizzariaService.get_nome_tamanho();
                html += STORAGE.get('tamanhos', item_dets.tamanho, 'nome_tamanho');

                switch (item_dets.num_sabores) {
                    case 1:
                        html += " : ";
                        html += STORAGE.get('cardapios_itens', item_dets.sabores_escolhidos[1], 'nome_item');
                        break;
                    case 2 :
                        html += " , meio-a-meio : ";
                        html += STORAGE.get('cardapios_itens', item_dets.sabores_escolhidos[1], 'nome_item');
                        html += " / ";
                        html += STORAGE.get('cardapios_itens', item_dets.sabores_escolhidos[2], 'nome_item');
                        break;
                    case 3:
                        html += " , 3 sabores : ";
                        html += STORAGE.get('cardapios_itens', item_dets.sabores_escolhidos[1], 'nome_item');
                        html += " / ";
                        html += STORAGE.get('cardapios_itens', item_dets.sabores_escolhidos[2], 'nome_item');
                        html += " / ";
                        html += STORAGE.get('cardapios_itens', item_dets.sabores_escolhidos[3], 'nome_item');
                        break;
                }

                html += "<BR>";

                if (item_dets.idmassa)
                    html += 'Massa ' + STORAGE.get('massas', item_dets.idmassa, 'nome_massa') + ' , ';

                html += "Borda " + (item_dets.borda == 'normal' ? 'Normal' : 'de ' + STORAGE.get('bordas', item_dets.idborda, 'nome_borda'));

                //party cut, a francesa, em aperitivo
                if (item_dets.corte == 'aperitivo')
                    html += "<BR>Cortada em aperitivo";

                if (item_dets.obs)
                    html += "<BR>Observação : " + item_dets.obs;

                break;

            default :
                html += PizzariaService.get_nome_item(item_dets.idcardapio_item);
                break;
        }

        return html;
    }

    this.addEditPizza = function(obj) {
        if (typeof obj.item_idx != 'undefined' && this.itens[obj.item_idx]) {
            this.itens[obj.item_idx] = obj;
        } else {
            this.itens_length++;
            this.itens_idx++;
            obj.cod_cardapio = 'P';
            obj.qtde = 1;
            this.itens[this.itens_idx] = obj;
        }
        this.view();
        NAV.back();
    }


    this.editItem = function(idx) {
        switch (this.itens[idx].cod_cardapio) {
            case 'P' :
                Pizza.reset();
                $.extend(Pizza, this.itens[idx], true);
                Pizza.item_idx = idx;
                Pizza.view();
                NAV.goto('page_pizza');
                break;
            default :
                break;
        }
    }

    this.removeItem = function(idx) {
        delete this.itens[idx];
        this.itens_length--;

        $('#tr_item_' + idx)
                .children('td, th')
                .animate({
                    padding: 0
                }, 500)
                .wrapInner('<div />')
                .children()
                .slideUp(250, function() {
                    $(this).closest('tr').remove();
                });

        this.viewPreco();

        if (!this.itens_length)
            this.view();
    }
})