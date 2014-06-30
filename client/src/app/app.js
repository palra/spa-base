angular.module( 'webapp', [
  'templates-app',
  'templates-common',
  'webapp.home',
  'webapp.messages',
  'webapp.about',
  'ui.router',
  'ui.bootstrap'
])

.config( function myAppConfig ($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise( '/' );
  $locationProvider.html5Mode(true);
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $rootScope ) {
  $rootScope.flashbag = [];
  $rootScope.addFlash = function(type, message) {
    $rootScope.flashbag.push({
      type: type,
      msg: message
    });
  };
  $rootScope.closeFlash = function(index) {
    $rootScope.flashbag.splice(index, 1);
  };

  $rootScope.addFlash('info', 'Welcome back, sir !');

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | webapp' ;
    }
  });
})

;

