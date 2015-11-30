controllers = angular.module('pizza.controllers', ['pizza.services']);

controllers.controller('AppCtrl', function(localStorageService, $ionicViewSwitcher, $state, $scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    $scope.novo_codpizzaria = function() {
        localStorageService.remove('uid_estab');
        //forward, back, enter, exit, swap.
        //console.dir($ionicViewSwitcher)
        //$ionicViewSwitcher.nextDirection('back');
        $state.go('codpizzaria')
    }
});

controllers.controller('SessionsCtrl', function($scope, Session) {
    $scope.sessions = Session.query();
});

controllers.controller('SessionCtrl', function($scope, $stateParams, Session) {
    $scope.session = Session.get({sessionId: $stateParams.sessionId});
});

controllers.controller('codpizzaria_ctrl', function(
        localStorageService
        , PizzariaService
        , $ionicLoading
        , $ionicHistory
        , $ionicViewSwitcher
        , $scope
        , $ionicPopup
        , $state
        ) {
    clog('codpizzaria_ctrl');
    // if none of the above states are matched, use this as the fallback
    //inicializacao da pagina inicial (todo : ver se eh aqui o lugar correto pra fazer isso)
    //if (localStorageService.get('uid_estab'))         $state.go('app.search')
    // if none of the above states are matched, use this as the fallback

    //scopes usados em ng-model precisam ter '.' ou child scopes podem conflitar
    localStorageService.bind($scope, 'codpizzaria_model.cod');

    $scope.enviar_cod = function() {
        $ionicLoading.show({
            template: 'Buscando pizzaria...'
            , noBackdrop: true
        });
        PizzariaService.get_dados_pizzaria($scope.codpizzaria_model.cod).then(
                function(res) {
                    // this callback will be called asynchronously
                    // when the response is available
                    if (!res.data.success) {
                        $ionicPopup.alert({
                            title: ''
                            , content: res.data.msg
                        }).then(function(res) {
                            //apos fechar alert
                            //console.log('Test Alert Box');
                        });
                    } else {
                        clog(' get_dados_pizzaria res', res)
                        //$ionicViewSwitcher.nextDirection('forward');
                        //nao estava limpando dados da pizzaria antiga :
                        $ionicHistory.clearCache().then(function() {
                            $state.go('app.mesa')
                        })
                    }
                },
                function(res) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $ionicPopup.alert({
                        title: ''
                        , content: 'Não foi possível pesquisar o código informado'
                    })
                });
    };
});


controllers.controller('mesa_ctrl', function(cfg, localStorageService, $http, $scope, $state) {
    clog('mesa_ctrl');
    $scope.estab = localStorageService.get('estab');

    $scope.logo_url = cfg.backend + 'imgs/logos_estab/' + localStorageService.get('uid_estab') + '.png';

    $scope.realizar_pedido = function() {
        $state.go('app.pedido');
    }
});




controllers.controller('cardapio_ctrl', function(PizzariaService, PedidoService, $ionicHistory, $stateParams, $scope, $state) {
    clog('cardapio_ctrl');
    var item, last_divider = false, divider = false, mock_item = {};

    $scope.cardapio = $stateParams;

    $scope.itens = PizzariaService.get_itens_cardapio($stateParams.idcardapio);

    $scope.add_item_to_pedido = function(idcardapio_item) {
        clog('add_item_to_pedido idcardapio_item=' + idcardapio_item)

        PedidoService.add_item(idcardapio_item);
        $ionicHistory.goBack();
    }
});


controllers.controller('pedido_ctrl', function(localStorageService, PedidoService, $scope, $state) {
    clog('pedido_ctrl');
    $scope.estab = localStorageService.get('estab');
   
   $scope.itens_grid = PedidoService.get_itens_grid_pedido();
   clog('itens_grid',$scope.itens_grid)
    //console.dir(localStorageService.get('estab'))

    $scope.open_cardapio = function(cardapio) {
        $state.go('app.cardapio', cardapio);
    }

    $scope.finalizar_pedido = function() {
        alert('finalizar_pedido')
    }
});

controllers.controller('pedido_atual_ctrl', function(PedidoService, $scope) {
    clog('pedido_atual_ctrl');

});

