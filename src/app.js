(function(){
    var app = angular.module('marvelGrability', []);

    app.controller('mainCtrl', ['$scope', 'apiMarvelService', function($scope, apiMarvelService){
        var model = this;

        model.getComcis = function getComcis(idCharacter){
            apiMarvelService.getComcis(idCharacter, function(response){
                console.log(response);
            })
        };

        model.getCharacters = function getCharacters(nameCharacter){
                apiMarvelService.getCharacters(nameCharacter, function(response){
                    console.log(response);
                    if(response){
                        if(response.status){
                            model.characters = response.data.data.results;
                            console.log(model.characters);
                        }else{
                                $log.error("Status is false:", response);
                                model.characters = {};
                        }
                    }else{
                        $log.error('Server error');
                        model.characters = {};
                    }
                });
        };


    }]);

    app.service('connectApiMarvel', ['$http', function($http){
        var model = this;

        model.endpoint = 'https://gateway.marvel.com:443/v1/public/characters';
        model.publicKey = "&apikey=9680732f936f2212243b63d0f868a98a";
        model.ts = 'ts=1';
        model.hash = "&hash=0cafc1b0a65703934c86a961f3cf2ad1";

        model.getComcis = function (idCharacter) {
            return $http({
                method: 'GET',
                data: {},
                url: model.endpoint + '/' + idCharacter + '/comics?format=comic&' + model.ts + model.publicKey + model.hash
            });
        };

        model.getCharacters = function (nameCharacter) {
            return $http({
                method: 'GET',
                data: {},
                url: model.endpoint + '?nameStartsWith=' + nameCharacter + '&' + model.ts + model.publicKey + model.hash
            });
        };
    }]);

    app.service('apiMarvelService', ['connectApiMarvel', function(connectApiMarvel){
        var model = this;

        model.getComcis = function (idCharacter, callback) {
            var getComcisPromise = connectApiMarvel.getComcis(idCharacter, callback);
            getComcisPromise.then(
                function success(response) {
                    callback({
                        status: response.status,
                        data: response.data,
                        info: response.info,
                    });
                },

                function error(response) {
                    callback({
                        status: response.data.status,
                        msg: response.data.error,
                        error: response.data.error.code,
                    });
                }
            );
        };

        model.getCharacters = function (idCharacter, callback) {
            var getCharactersPromise = connectApiMarvel.getCharacters(idCharacter, callback);
            getCharactersPromise.then(
                function success(response) {
                    callback({
                        status: response.status,
                        data: response.data,
                        info: response.info,
                    });
                },

                function error(response) {
                    callback({
                        status: response.data.status,
                        msg: response.data.error,
                        error: response.data.error.code,
                    });
                }
            );
        };

    }]);

})();

