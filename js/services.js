angular.module('pizza.services', ['ngResource'])
        .factory('Session', function($resource) {
            return $resource('http://localhost:5000/sessions/:sessionId');
        });

app.service('PizzariaService', function(cfg, $http) {
    this.get_dados_pizzaria = function(codpizzaria) {
        return $http({
            method: 'GET'
            , url: cfg.backend
            , params: {m: 'getUidEstab', codigo: codpizzaria}
            , cache: false
        });
    };
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