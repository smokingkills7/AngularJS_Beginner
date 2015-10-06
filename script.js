
(function () {
    var app = angular.module("githubViewer", []);    

    var MyController = function ($scope, $http, $interval, $log, $anchorScroll, $location) {

        var onUserComplete = function (response) {
            $scope.user = response.data;
            $http.get($scope.user.repos_url).
                then(onRepos, onError);
        };
        var onRepos = function (response) {
            $scope.repos = response.data;
            $location.hash("userDetails");
            $anchorScroll();
        };
        var onError = function (response) {
            $scope.error = "Couldn't fetch user data";
        };
        $scope.search = function (username) {
            $log.info("Searching for" + username);
            $http.get("https://api.github.com/users/" + username).
            then(onUserComplete, onError);
            if (countdownInterval) {
                $interval.cancel(countdownInterval);
                $scope.countdown = null;
            }
        };

        var decrementCountdown = function () {
            $scope.countdown -= 1;
            if ($scope.countdown < 1)
                $scope.search($scope.username);
        };
        var countdownInterval = null;
        var startCountdown = function () {
            countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
        };

        $scope.username = "angular";
        $scope.repoSortOrder = "-stargazers_count";
        $scope.countdown = 5;
        startCountdown();
    };

    app.controller("MyController", MyController);
    //app.controller("MyController", ["$scope", "$http", "$interval", MyController]);
}());
