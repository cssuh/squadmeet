(function() {
    var app = angular.module('squadup', ['ngRoute'])
        .config(function($routeProvider) {
            $routeProvider
                .when("/", {
                	template: "HELLO WORLD",
                    controller: 'mainController'
                })
                .when("/:room_id", {
                	template: "ENTERING THE ROOM"
                })
                .when("/u/:user_id", {

                })
        })
        .controller('mainController', function($scope, $http) {
            $scope.title = "SquadUp - Plan Meetups, Not Headaches";

            $scope.createRoom = function() {
                $http.post('/api/rooms')
                    .success(function(data) {

                    }).error(function() {

                    });
            };

            $scope.getRoom = function(room_id) {
                $http.get('/api/rooms/' + room_id)
                    .success(function(data) {
                        console.log(data);
                    }).error(function() {

                    });
            };

            // for testing purposes only
            // should not actually be used
            $scope.getRooms = function() {
                $http.get('/api/rooms')
                    .success(function(data) {
                        console.log(data);
                    }).error(function() {

                    });
            }

            $scope.deleteRoom = function() {

            };
        })
        .controller('header', function($scope){
        	 $scope.title = "SquadUp - Plan Meetups, Not Headaches";
        });
})();