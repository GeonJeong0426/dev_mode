'use strict';

var app = angular.module('application', []);

app.controller('AppCtrl', function($scope, appFactory){
   $("#success_init").hide();
//    $("#success_qurey").hide();
//    $("#success_qurey_admin").hide();
//    $("#success_qurey_lotto").hide();
   $("#success_delete").hide();
   $("#success_gift").hide();
   $("#success_payment").hide();
   $("#success_lotto").hide();
   $("#success_query_all").hide();
   $("#success_draw_lotto").hide();
   $("#success_recommender").hide();


    $scope.initAB = function() {
        appFactory.initAB($scope.abstore, function(data) {
            if (data === "") {
                $scope.init_ab = "success";
            } else {
                $scope.init_ab = "This is a duplicate user";
            }
            $("#success_init").show();
        });
    }
    $scope.recommenderAB = function(){
        appFactory.recommenderAB($scope.abstore, function(data){
            if(data == "")
                $scope.recommender_ab = "success";
            else
                scope.recommender_ab = "You have already registered a recommender";
            $("#success_recommender").show();
        });
    }
//    $scope.queryAB = function(){
//        appFactory.queryAB($scope.walletid, function(data){
//            $scope.query_ab = data;
//            $("#success_qurey").show();
//        });
//    }
//    $scope.queryAdmin = function(){
//         appFactory.queryAB("admin", function(data){
//             $scope.query_admin = data;
//             $("#success_qurey_admin").show();
//         });
//     }
//     $scope.queryLotto = function(){
//         appFactory.queryAB("lotto", function(data){
//             $scope.query_lotto = data;
//             $("#success_qurey_lotto").show();
//         });
//     }
   $scope.deleteAB = function(){
        appFactory.deleteAB($scope.walletid2, function(data){
            if(data == "")
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
    $scope.drawLotto = function() {
        appFactory.drawLotto(function(data) {
            $scope.draw_lotto = data;
            $("#success_draw_lotto").show();
        });
    };
    $scope.queryAll = function() {
        appFactory.queryAll(function(data) {
            $scope.query_all = JSON.parse(data);
            $("#success_query_all").show();
        });
    };    
});

app.factory('appFactory', function($http){
      
    var factory = {};
 
    factory.initAB = function(data, callback){
        $http.get('/init?a='+data.a).success(function(output){
            callback(output)
        });
    }
    factory.recommenderAB = function(args, callback){
        let me = args.me;
        let recommender = args.recommender;
        $http.get('/recommender?me=' + me+'&recommender=' + recommender).success(function(output){
            callback(output);
        });
    }
    // factory.queryAB = function(name, callback){
    //     $http.get('/query?name='+name).success(function(output){
    //         callback(output)
    //     });
    // }
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
        }).error(function(error){
            callback('Error: ' + error);
        });
    }
    factory.drawLotto = function(callback) {
        $http.get('/drawLotto').success(function(output) {
            callback(output);
        }).error(function(error) {
            callback('Error: ' + error);
        });
    };
    factory.queryAll = function(callback){
        $http.get('/queryAll').success(function(output){
            callback(output);
        }).error(function(error){
            callback('Error: ' + error);
        });
    };
    return factory;
 });
 