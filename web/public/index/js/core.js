(function() {
    var app = angular.module('squadup', ['ngRoute', 'ngCookies'])
        .config(function($routeProvider, $locationProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "partials/home",
                    controller: 'mainController'
                })
                .when("/:room_id", {
                    templateUrl: "partials/room",
                    controller: 'roomController'
                })
                .when("/u/:user_id", {
                    template: 'partials/user',
                    controller: 'profileController'
                })
                .otherwise({
                    template: "Oops, we couldn't find that page!"
                })

            // enable HTML5mode to disable hashbang urls
            $locationProvider.html5Mode(true);
        })
        .service('roomService', function($http) {
            this.updateRoom = function(data, cb){
                //you can only edit the room if you're the one who created it
            }

            this.createRoom = function(cb) {
                $http.post('/api/rooms')
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function() {

                    })
            }

            this.getRoom = function(options, cb) {
                var url = 'api/rooms';
                var options = {
                    id: options.id || '',
                    sort: options.sort || '',
                    expand: options.expand || '',
                    limit: options.limit || '',
                }
                url += (options.id) ? '/' + options.id : '';
                $http.get(url)
                    .success(function(data) {
                        console.log(data);
                        data.created = new Date(data.created);
                        if (typeof cb == "function") {
                            cb(data);
                        }
                    })
                    .error(function() {
                        //an unexpected error occured
                    })
            }
        })
        .service('userService', function($http, $cookies) {
            this.getUser = function(user_id) {

            }
        })
        .controller('mainController', function($scope, $http, $cookies) {

        })
        .controller('roomController', function($scope, $routeParams, roomService) {
            $scope.room = null;
            roomService.getRoom({
                id: $routeParams.room_id
            }, function(data) {
                $scope.room = data;
            });

        })
        .controller('profileController', function($scope, $routeParams, userService) {
            userService.getUser($routeParams.user_id);
        })
        .controller('header', function($scope) {
            $scope.title = "SquadMeet - Plan Meetups, Not Headaches";
        });
})();