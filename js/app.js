// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.controllers' is found in controllers.js
app = angular.module('pizza', ['ionic', 'ui.router', 'pizza.controllers', 'LocalStorageModule']);

app.constant('cfg', {
    appName: 'Minha Pizza'
    , appVersion: 0.1
    , backend:
            (localStorage.getItem('destktop_version') != 1)
            ? 'http://m.multidadosti.com.br/m_apps/queropizzaw/'
            : 'http://' + window.location.host + '/m_apps/queropizzaw/'
});

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
clog('config')
    //para desabilitar o cache por completo : $ionicConfigProvider.views.maxCache(0);

    localStorageServiceProvider.setPrefix('pizza');

    $stateProvider.state('app', {
        url: '/app',
        abstract: true, //abstract nao pode ser transitioned to, ele eh acionado quando um nested state eh acionado
        templateUrl: '/menu.html',
        controller: 'AppCtrl'
    });

    $stateProvider.state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: '/search.html'
            }
        }
    });

    $stateProvider.state('app.browse', {
        url: '/browse',
        views: {
            'menuContent': {
                templateUrl: '/browse.html'
            }
        }
    });

    $stateProvider.state('app.sessions', {
        url: "/sessions",
        views: {
            'menuContent': {
                templateUrl: "/sessions.html",
                controller: 'SessionsCtrl'
            }
        }
    });

    $stateProvider.state('app.session', {
        url: "/sessions/:sessionId",
        views: {
            'menuContent': {
                templateUrl: "/session.html",
                controller: 'SessionCtrl'
            }
        }
    });

    $stateProvider.state('codpizzaria', {
        url: "/codpizzaria",
        templateUrl: "/codpizzaria.html",
        controller: 'codpizzaria_ctrl'
    });

    $stateProvider.state('app.mesa', {
        url: "/mesa",
        views: {
            'menuContent': {
                templateUrl: "/mesa.html",
                controller: 'mesa_ctrl'
            }
        }
    });

    $stateProvider.state('app.pedido', {
        url: "/pedido",
        views: {
            'menuContent': {
                templateUrl: "/pedido.html",
                controller: 'pedido_ctrl'
            }
        }
    });

    $stateProvider.state('app.cardapio', {
        url: "/cardapio"
        , params: {cod_cardapio: null, idcardapio: null, desc_ui_cardapio: null}
        , views: {
            'menuContent': {
                templateUrl: "/cardapio.html",
                controller: 'cardapio_ctrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    //inicializacao da pagina inicial (todo : ver se eh aqui o lugar correto pra fazer isso)
    if (localStorage.getItem('pizza.uid_estab')) {
        $urlRouterProvider.otherwise('/app/mesa');
    } else {
        $urlRouterProvider.otherwise('/codpizzaria');
    }
});
