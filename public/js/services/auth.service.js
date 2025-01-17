(function () {
    'use strict';

    angular
        .module('app')
        .factory('Auth', Auth);

    Auth.$inject = ['$localStorage', 'App', 'User', '$location', '$rootScope'];

    function Auth($localStorage, App, User, $location, $rootScope) {

        return {

            login: function (data) {
                User.login({email: data.email, password: data.password}, function (res) {
                    App.clearData();
                    App.token = res.data.token;
                    $localStorage.set('token', res.data.token);

                    User.getUser(function (res) {
                        App.user = res.data;
                        $localStorage.setObject('user', App.user);
                        $rootScope.$broadcast('user', App.user);
                        $location.path('/dashboard');
                    }, function (error) {
                        // error
                        $rootScope.$broadcast('error-login', {message: 'Usuário não encontrado!'});
                    });
                }, function (error) {
                    // error
                    $rootScope.$broadcast('error-login', {message: 'Usuário não encontrado!'});
                });
            },
            isAuthenticated: function(){
                if (!App.user) {
                    User.getUser(function (res) {
                        App.user = res.data;
                        $localStorage.setObject('user', App.user);
                        $rootScope.$broadcast('user', App.user);
                    }, function (error) {
                        // error
                        //$rootScope.$broadcast('error-login', {message: 'Usuário não encontrado!'});
                    });
                }
                return App.user;
            },
            isAuthorized: function(){
                if (!App.token) {
                    App.token = $localStorage.get('token');
                }
                return App.token;
            }
        };
    }
})();