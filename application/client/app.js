'use strict';

var app = angular.module('application', []);

app.controller('AppCtrl', function($scope, appFactory){
   $("#success_init").hide();
   $("#success_qurey").hide();
   $("#success_qurey_admin").hide();
   $("#success_qurey_lotto").hide();
   $("#success_qurey").hide();
   $("#success_delete").hide();
   $("#success_gift").hide();
   $("#success_payment").hide();
   $("#success_lotto").hide();

   $scope.initAB = function(){
       appFactory.initAB($scope.abstore, function(data){
           if(data == "")
           $scope.init_ab = "success";
           $("#success_init").show();
       });
   }
   $scope.queryAB = function(){
       appFactory.queryAB($scope.walletid, function(data){
           $scope.query_ab = data;
           $("#success_qurey").show();
       });
   }
   $scope.queryAdmin = function(){
        appFactory.queryAB("admin", function(data){
            $scope.query_admin = data;
            $("#success_qurey_admin").show();
        });
    }
    $scope.queryLotto = function(){
        appFactory.queryAB("lotto", function(data){
            $scope.query_lotto = data;
            $("#success_qurey_lotto").show();
        });
    }
   $scope.deleteAB = function(){
        appFactory.deleteAB($scope.walletid2, function(data){
            if(data == "success")
                $scope.delete_ab = "User deleted successfully.";
            else
                $scope.delete_ab = "Error deleting user.";
            $("#success_delete").show();
        });
    }
    $scope.giftAB = function(){
        appFactory.giftAB($scope.abstore2, function(data){
            if(data == "")
            $scope.gift_ab = "success";
            $("#success_gift").show();
        });
    }
    $scope.paymentAB = function(){
        appFactory.paymentAB($scope.abstore2, function(data){
            if(data == "")
            $scope.payment_ab = "success";
            $("#success_payment").show();
        });
    }
    $scope.lottoAB = function(){
        appFactory.lottoAB($scope.abstore2, function(data){
            if(data == "")
            $scope.lotto_ab = "success";
            $("#success_lotto").show();
        });
    }
});
app.factory('appFactory', function($http){
      
    var factory = {};
 
    factory.initAB = function(data, callback){
        $http.get('/init?a='+data.a).success(function(output){
            callback(output)
        });
    }
    factory.queryAB = function(name, callback){
        $http.get('/query?name='+name).success(function(output){
            callback(output)
        });
    }
    factory.giftAB = function(args, callback){
        let sender = args.a;
        let receiver = args.b;
        let amount = args.amount;
        $http.get('/gift?sender=' + sender+'&receiver=' + receiver + '&amount=' + amount).success(function(output){
            callback(output);
        });
    }

    factory.deleteAB = function(name, callback){
        $http.get('/delete?name=' + name).success(function(output){
            callback(output);
        });
    }
    factory.paymentAB = function(args, callback){
        let user = args.user;
        let amount = args.pay;
        let pointsToUse = args.point;
        $http.get('/payment?user=' + user + '&amount=' + amount + '&pointsToUse=' + pointsToUse).success(function(output){
            callback(output);
        });
    }
    factory.lottoAB = function(args, callback){
        let user = args.userLotto;
        $http.get('/lotto?user=' + user).success(function(output){
            callback(output);
        });
    }
    return factory;
 });
 