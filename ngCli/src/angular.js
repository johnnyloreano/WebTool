var app = angular.module("webTool",[]);

app.controller("pdbParser",function($scope,$http) {
    $scope.pdbName= "AS";
    $scope.parser = function(){
        console.log('AA');
        alert("aa");
        $http({
            url:"localhost:5000/dataParser",
            method: "POST",
            params: {pdbName: "1zdd"}
        })
    }
});