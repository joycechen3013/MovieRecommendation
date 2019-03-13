var app = angular.module('angularjsNodejsTutorial', []);
app.controller('loginController', function($scope, $http) {
  $scope.verifyLogin = function() {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);

    var request = $http({
      url: '/login',
      method: "POST",
      data: {
        'username': $scope.username,
        'password': $scope.password
      }
    })

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        // After you've written the INSERT query in routes/index.js, uncomment the following line
        window.location.href = "http://localhost:8081/dashboard"
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };
});

// Template for adding a controller

app.controller('userController', function($scope, $http) {
  // normal variables
  //var dummyVar1 = 'abc';

  // Angular scope variables
  //$scope.dummyVar2 = 'abc';

  // Angular function
  //$scope.dummyFunction = function() {

  //};

  $scope.years=["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"];

  $scope.genreSubmit= function() {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);
    var url='/yearMovies/'+$scope.selectedYear;
    var request3 = $http({
      url: url,
      method: "GET",
    })

    request3.success(function(response) {
      // success
      $scope.yearmovies=response;
      
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };



  var request = $http({
      url: '/users',
      method: "GET",
  })


  request.success(function(response){
  
         $scope.users=response;
      
  });

  var request2 = $http({
      url: '/topMovies',
      method: "GET",
  })
  request2.success(function(response){
        $scope.genres=response
      
  });
//   $scope.pickGenre = function(genre) {

//     var request3= $http({
//         url: '/buttonMovies',
//         method: "GET",
//         data:{
//           genre:$scope.genre;
//         }
//   })

   
    
//         // After you've written the INSERT query in routes/index.js, uncomment the following line
//     request3.success(function(response){
//            $scope.var=response;
//     });
      

// };
$scope.pickGenre = function(genre) {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);

    var url = '/buttonMovies/' + genre;

    var request = $http({
      url: url,
      method: "GET"
    })

    request.success(function(response) {
      // success
      $scope.choice=response;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };


});

app.controller('movieController', function($scope, $http) {
  $scope.movieDisplay = function() {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);
    var url='/moviegenre/'+$scope.movieid;
    var request = $http({
      url: url,
      method: "GET",
    })

    request.success(function(response) {
      // success
      //$scope.genres=response;
      $scope.movies=response;
      $scope.quantity=10-response.length;
      
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

    var url2='/moviegenres/'+$scope.movieid;
    var request2 = $http({
      url: url2,
      method: "GET",
    })

    request2.success(function(response) {
      // success
      //$scope.movies=response;
      $scope.mmovies=response;
      
    });

    request2.error(function(err) {
      // failed
      console.log("error: ", err);
    });
    // $scope.result=[];
    // for (i = 0, len = $scope.genres.length; i < len; i++) {
    //     for(j= 0, len = $scope.movies.length; j< len; j++){
    //       if(($scope.movies[j].genre==$scope.genres[i]) && (!($scope.movies[j] in $scope.result))){
    //         $scope.result.push($scope.movies[j]);
    //         break;
    //       }
    //     }
    // }
    // for(j= 0, len = $scope.movies.length; j< len; j++){
    //       if (($scope.result.length<10) && (!($scope.movies[j] in $scope.result))){
    //         $scope.result.push($scope.movies[j]);
    //       }
    // }

  };
});
app.controller('posterController', function($scope, $http) {
  
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);

    var request = $http({
      url: '/poster',
      method: "GET",
    })

    request.success(function(response) {
      // success
      console.log(response);
      var movies=response;
      $scope.result=[];
      for (i = 0, len = movies.length; i < len; i++) { 
           var request = $http({
           url: "http://www.omdbapi.com/?apikey=ea9a911d&i=" + movies[i].id,
           method: "GET",
           })
           request.success(function(response){
                  if (response.Website === "N/A") {
                       response.Website="javascript:void(0)";
                 }
                  $scope.result.push(response);
        
                // $scope.posters.push(response.Poster);
                // if (response.Website === "N/A") {
                //      $scope.web.push("javascript:void(0)");
                //  }
                //  else{
                // $scope.web.push(response.Website);
                // }
           });
       }


    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  
});
