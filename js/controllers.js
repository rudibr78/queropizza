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

controllers.controller('codpizzaria_ctrl', function(localStorageService, PizzariaService, $ionicHistory, $ionicViewSwitcher, $scope, $ionicPopup, $state) {
    clog('codpizzaria_ctrl');
    // if none of the above states are matched, use this as the fallback
    //inicializacao da pagina inicial (todo : ver se eh aqui o lugar correto pra fazer isso)
    //if (localStorageService.get('uid_estab'))         $state.go('app.search')
    // if none of the above states are matched, use this as the fallback

    //scopes usados em ng-model precisam ter '.' ou child scopes podem conflitar
    localStorageService.bind($scope, 'codpizzaria_model.cod');

    $scope.enviar_cod = function() {
        PizzariaService.get_dados_pizzaria($scope.codpizzaria_model.cod).then(function successCallback(res) {
            if (!res.data.success) {
                $ionicPopup.alert({
                    title: ''
                    , content: res.data.msg
                }).then(function(res) {
                    //apos fechar alert
                    //console.log('Test Alert Box');
                });
            } else {
                console.log('res');
                console.dir(res)
                localStorageService.set('uid_estab', res.data.uid_estab);
                localStorageService.set('estab', res.data.estab);
                //$ionicViewSwitcher.nextDirection('forward');
                //nao estava limpando dados da pizzaria antiga :
                $ionicHistory.clearCache().then(function() {
                    $state.go('app.mesa')
                })
            }
            console.log('s');
            console.dir(res);
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(res) {
            $ionicPopup.alert({
                title: ''
                , content: 'Não foi possível pesquisar o código informado'
            })
            console.log('e');
            console.dir(res);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
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


controllers.controller('pedido_ctrl', function(localStorageService, $scope, $state) {
    clog('pedido_ctrl');
    $scope.estab = localStorageService.get('estab');
    console.log('localStorageService.get("estab")')
    console.dir(localStorageService.get('estab'))
    //console.dir(localStorageService.get('estab'))

    $scope.open_cardapio = function(cardapio) {
        $state.go('app.cardapio', cardapio);
    }
});



controllers.controller('cardapio_ctrl', function(localStorageService, $stateParams, $scope, $state) {
    clog('cardapio_ctrl');
    var item, last_divider = false, divider = false, mock_item = {};

    $scope.estab = localStorageService.get('estab');
    $scope.cardapio = $stateParams;

    $scope.itens = [];
    for (var i = 0; i < $scope.estab.cardapios_itens.length; i++) {
        item = $scope.estab.cardapios_itens[i];
        if (item.idcardapio != $stateParams.idcardapio)
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

            $scope.itens.push(mock_item);
        } else {
            item.divider = false;

            $scope.itens.push(item);
        }
    }

    clog('itens', $scope.itens);

    $scope.add_item_to_pedido = function(idcardapio_item) {
        alert(idcardapio_item)
    }
});

